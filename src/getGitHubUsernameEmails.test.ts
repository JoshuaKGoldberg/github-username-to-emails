import { describe, expect, it, vi } from "vitest";

import { getGitHubUsernameEmails } from "./getGitHubUsernameEmails.js";

const mockGetGitHubAuthToken = vi.fn();

vi.mock("get-github-auth-token", () => ({
	get getGitHubAuthToken() {
		return mockGetGitHubAuthToken;
	},
}));

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
	it("throws an error when no auth is provided or available", async () => {
		mockGetGitHubAuthToken.mockResolvedValue({
			succeeded: false,
			token: "gho_def456",
		});

		await expect(
			async () => await getGitHubUsernameEmails({ username }),
		).rejects.toMatchInlineSnapshot(
			`[Error: Please provide an auth token (process.env.GH_TOKEN) or log in with the GitHub CLI (gh).]`,
		);
	});

	it("throws an error an empty auth is provided", async () => {
		mockGetGitHubAuthToken.mockResolvedValue({
			succeeded: true,
			token: "gho_def456",
		});

		await expect(
			async () => await getGitHubUsernameEmails({ auth: "", username }),
		).rejects.toMatchInlineSnapshot(
			`[Error: Invalid auth provided: an empty string ('').]`,
		);
	});

	it("returns account and events emails when getGitHubAuthToken auth is valid", async () => {
		mockGetGitHubAuthToken.mockResolvedValue({
			succeeded: true,
			token: "gho_def456",
		});

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
