import { Octokit } from "octokit";
import { MockInstance, describe, expect, it, vi } from "vitest";

import { getAccountEmail } from "./getAccountEmail.js";

const createMockOctokit = (request: MockInstance) =>
	({ request }) as unknown as Octokit;

const options = { historyLimit: 9001, username: "abc123" };

describe("getAccountEmail", () => {
	it("returns no email when the GitHub api returns no email", async () => {
		const request = vi.fn().mockResolvedValue({ data: {} });

		const actual = await getAccountEmail(createMockOctokit(request), options);

		expect(actual).toBeUndefined();
	});

	it("returns an email when the GitHub api returns an email", async () => {
		const email = "abc123@test.com";
		const request = vi.fn().mockResolvedValue({ data: { email } });

		const actual = await getAccountEmail(createMockOctokit(request), options);

		expect(actual).toBe(email);
	});
});
