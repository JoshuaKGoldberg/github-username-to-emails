import { Octokit } from "octokit";
import { describe, expect, it, MockInstance, vi } from "vitest";

import { getEventsEmails } from "./getEventsEmails.js";

const createMockOctokit = (request: MockInstance) =>
	({ request }) as unknown as Octokit;

const options = { historyLimit: 9001, username: "abc123" };

describe("getEventsEmails", () => {
	it("returns no emails when the GitHub api returns no events", async () => {
		const request = vi.fn().mockResolvedValue({ data: [] });

		const actual = await getEventsEmails(createMockOctokit(request), options);

		expect(actual).toEqual({});
	});

	it("returns no emails when the GitHub api returns no events with emails", async () => {
		const request = vi.fn().mockResolvedValue({
			data: [
				{
					payload: {
						commits: [{ author: {} }],
					},
				},
			],
		});

		const actual = await getEventsEmails(createMockOctokit(request), options);

		expect(actual).toEqual({});
	});

	it("returns deduplicated emails when the GitHub api returns events with emails", async () => {
		const email1 = "email-1@test.com";
		const email2 = "email-2@test.com";
		const name = "Abc 123";

		const request = vi.fn().mockResolvedValue({
			data: [
				{
					payload: {
						commits: [{ author: { email: email1, name } }],
					},
				},
				{
					payload: {
						commits: [
							{ author: { email: email2, name } },
							{ author: { email: email1, name } },
						],
					},
				},
			],
		});

		const actual = await getEventsEmails(createMockOctokit(request), options);

		expect(actual).toEqual({ [email1]: [name], [email2]: [name] });
	});

	it("ignores an email when it's an auto-generated noreply email", async () => {
		const email = "email@test.com";
		const name = "Abc 123";

		const request = vi.fn().mockResolvedValue({
			data: [
				{
					payload: {
						commits: [{ author: { email, name } }],
					},
				},
				{
					payload: {
						commits: [
							{ author: { email: "test@users.noreply.github.com", name } },
							{ author: { email, name } },
						],
					},
				},
			],
		});

		const actual = await getEventsEmails(createMockOctokit(request), options);

		expect(actual).toEqual({ [email]: [name] });
	});
});
