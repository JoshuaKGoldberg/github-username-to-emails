import { describe, expect, it, vi } from "vitest";

import { getGitHubUsernameEmails } from "./getGitHubUsernameEmails.js";

vi.mock("octokit-from-auth", () => ({
	octokitFromAuth: () =>
		Promise.resolve({
			request: vi.fn(),
		}),
}));

vi.mock("./getAccountEmail.js", () => ({
	getAccountEmail: vi.fn().mockResolvedValue("account-email@test.com"),
}));

vi.mock("./getCommitsEmails.js", () => ({
	getCommitsEmails: vi
		.fn()
		.mockResolvedValue({ "commits-email": ["Name Test"] }),
}));

const username = "abc123";

describe("getGitHubUsernameEmails", () => {
	it("returns account and events emails", async () => {
		const actual = await getGitHubUsernameEmails({ username });

		expect(actual).toMatchInlineSnapshot(`
			{
			  "account": "account-email@test.com",
			  "events": {
			    "commits-email": [
			      "Name Test",
			    ],
			  },
			}
		`);
	});
});
