import { describe, expect, it, vi } from "vitest";

import { getGitHubUsernameEmails } from "./getGitHubUsernameEmails.js";

vi.mock("octokit", () => ({
	Octokit: class MockOctokit {
		request = vi.fn();
	},
}));

vi.mock("./getAccountEmail.js", () => ({
	getAccountEmail: vi.fn().mockResolvedValue("account-email@test.com"),
}));

vi.mock("./getEventsEmails.js", () => ({
	getEventsEmails: vi.fn().mockResolvedValue({ "events-email": ["Name Test"] }),
}));

const username = "abc123";

describe("getGitHubUsernameEmails", () => {
	it("throws an error when no auth is provided or available on process.env", async () => {
		process.env.GH_TOKEN = "";

		await expect(
			async () => await getGitHubUsernameEmails({ username }),
		).rejects.toMatchInlineSnapshot(
			`[Error: Please provide an auth token (process.env.GH_TOKEN).]`,
		);
	});

	it("throws an error an empty auth is provided", async () => {
		process.env.GH_TOKEN = "gho_def456";

		await expect(
			async () => await getGitHubUsernameEmails({ auth: "", username }),
		).rejects.toMatchInlineSnapshot(
			`[Error: Please provide an auth token (process.env.GH_TOKEN).]`,
		);
	});

	it("returns account and events emails when auth is valid", async () => {
		process.env.GH_TOKEN = "gho_def456";

		const actual = await getGitHubUsernameEmails({ username });

		expect(actual).toMatchInlineSnapshot(`
			{
			  "account": "account-email@test.com",
			  "events": {
			    "events-email": [
			      "Name Test",
			    ],
			  },
			}
		`);
	});
});
