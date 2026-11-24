import { describe, expect, it, vi } from "vitest";

import { getGitHubUsernameEmails } from "./getGitHubUsernameEmails.ts";

vi.mock("octokit-from-auth", () => ({
	octokitFromAuth: () =>
		Promise.resolve({
			request: vi.fn(),
		}),
}));

vi.mock("./getAccountEmail.ts", () => ({
	getAccountEmail: vi.fn().mockResolvedValue("account-email@test.com"),
}));

vi.mock("./getCommitsEmails.ts", () => ({
	getCommitsEmails: vi
		.fn()
		.mockResolvedValue({ "commits-email": ["Name Test"] }),
}));

const username = "abc123";

describe(getGitHubUsernameEmails, () => {
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
