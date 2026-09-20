import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { getCommitsEmails } from "./getCommitsEmails.js";

interface MockCommit {
	commit: {
		author: {
			email?: string;
			name?: string;
		};
	};
}

type MockMapFunction = (
	response: { data: MockCommit[] },
	done: () => void,
) => MockCommit[];

const createMockOctokit = (pages: MockCommit[][]) => {
	const paginate = vi.fn(
		async (_route: string, _parameters: object, mapFn: MockMapFunction) => {
			const done = vi.fn();
			let results: MockCommit[] = [];

			for (const page of pages) {
				results = results.concat(mapFn({ data: page }, done));

				if (done.mock.calls.length) {
					break;
				}
			}

			return Promise.resolve(results);
		},
	);

	return {
		octokit: { paginate } as unknown as Octokit,
		paginate,
	};
};

const commit = (email?: string, name?: string): MockCommit => ({
	commit: { author: { email, name } },
});

const options = { historyLimit: 9001, username: "abc123" };

describe("getCommitsEmails", () => {
	it("returns no emails when the GitHub api returns no commits", async () => {
		const { octokit } = createMockOctokit([[]]);

		const actual = await getCommitsEmails(octokit, options);

		expect(actual).toEqual({});
	});

	it("returns no emails when the GitHub api returns no commits with emails", async () => {
		const { octokit } = createMockOctokit([[commit()]]);

		const actual = await getCommitsEmails(octokit, options);

		expect(actual).toEqual({});
	});

	it("returns deduplicated emails when the GitHub api returns commits with emails", async () => {
		const email1 = "email-1@test.com";
		const email2 = "email-2@test.com";
		const name = "Abc 123";

		const { octokit } = createMockOctokit([
			[commit(email1, name), commit(email2, name), commit(email1, name)],
		]);

		const actual = await getCommitsEmails(octokit, options);

		expect(actual).toEqual({ [email1]: [name], [email2]: [name] });
	});

	it("ignores an email when it's an auto-generated noreply email", async () => {
		const email = "email@test.com";
		const name = "Abc 123";

		const { octokit } = createMockOctokit([
			[
				commit(email, name),
				commit("test@users.noreply.github.com", name),
				commit(email, name),
			],
		]);

		const actual = await getCommitsEmails(octokit, options);

		expect(actual).toEqual({ [email]: [name] });
	});

	it("searches for commits authored by the username", async () => {
		const { octokit, paginate } = createMockOctokit([[]]);

		await getCommitsEmails(octokit, options);

		expect(paginate).toHaveBeenCalledWith(
			"GET /search/commits",
			{
				per_page: 100,
				q: "author:abc123",
				sort: "author-date",
			},
			expect.any(Function),
		);
	});

	it("requests fewer results per page when the history limit is under 100", async () => {
		const { octokit, paginate } = createMockOctokit([[]]);

		await getCommitsEmails(octokit, { ...options, historyLimit: 7 });

		expect(paginate).toHaveBeenCalledWith(
			"GET /search/commits",
			expect.objectContaining({ per_page: 7 }),
			expect.any(Function),
		);
	});

	it("stops paginating once the history limit is reached", async () => {
		const name = "Abc 123";
		const { octokit } = createMockOctokit([
			[commit("email-1@test.com", name), commit("email-2@test.com", name)],
			[commit("email-3@test.com", name), commit("email-4@test.com", name)],
			[commit("email-5@test.com", name)],
		]);

		const actual = await getCommitsEmails(octokit, {
			...options,
			historyLimit: 3,
		});

		expect(actual).toEqual({
			"email-1@test.com": [name],
			"email-2@test.com": [name],
			"email-3@test.com": [name],
		});
	});

	it("caps the history limit at GitHub's 1,000 search results", async () => {
		const name = "Abc 123";
		const { octokit } = createMockOctokit([
			Array.from({ length: 1000 }, (_, i) =>
				commit(`email-${i}@test.com`, name),
			),
			[commit("email-1000@test.com", name)],
		]);

		const actual = await getCommitsEmails(octokit, {
			...options,
			historyLimit: 1500,
		});

		expect(Object.keys(actual)).toHaveLength(1000);
		expect(actual).not.toHaveProperty("email-1000@test.com");
	});
});
