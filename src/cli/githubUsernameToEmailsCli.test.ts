import { beforeEach, describe, expect, it, vi } from "vitest";

import { githubUsernameToEmailsCli } from "./githubUsernameToEmailsCli.js";

const mockGetGitHubUsernameEmails = vi.fn();

vi.mock("../getGitHubUsernameEmails.js", () => ({
	get getGitHubUsernameEmails() {
		return mockGetGitHubUsernameEmails;
	},
}));

const mockLog = vi.fn();

describe("githubUsernameToEmailsCli", () => {
	beforeEach(() => {
		console.log = mockLog;
	});

	it("throws an error when zero args are provided", async () => {
		await expect(async () => {
			await githubUsernameToEmailsCli([]);
		}).rejects.toMatchInlineSnapshot(
			`[Error: Provide exactly one username, like \`npx github-username-to-emails joshuakgoldberg\`]`,
		);
	});

	it("throws an error when two args are provided", async () => {
		await expect(async () => {
			await githubUsernameToEmailsCli(["abc", "def"]);
		}).rejects.toMatchInlineSnapshot(
			`[Error: Provide exactly one username, like \`npx github-username-to-emails joshuakgoldberg\`]`,
		);
	});

	it("logs nothing when nothing is found", async () => {
		mockGetGitHubUsernameEmails.mockResolvedValue({
			account: undefined,
			events: [],
		});

		await githubUsernameToEmailsCli(["abc"]);

		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Account email: None found...",
			  ],
			  [
			    "Event Email(s): None found...",
			  ],
			]
		`);
	});

	it("logs results when results are found", async () => {
		mockGetGitHubUsernameEmails.mockResolvedValue({
			account: "abc@def.com",
			events: {
				"event-one": ["ghi1", "jkl1"],
				"event-two": ["ghi2", "jkl2"],
			},
		});

		await githubUsernameToEmailsCli(["abc"]);

		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Account email: abc@def.com",
			  ],
			  [
			    "Event Email(s): 2",
			  ],
			  [
			    " - event-one, with names: ghi1, jkl1",
			  ],
			  [
			    " - event-two, with names: ghi2, jkl2",
			  ],
			]
		`);
	});
});
