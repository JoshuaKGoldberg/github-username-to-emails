import { octokitFromAuth } from "octokit-from-auth";

import { getAccountEmail } from "./getAccountEmail.js";
import { getEventsEmails } from "./getEventsEmails.js";
import { defaultOptions, GitHubUsernameEmailsOptions } from "./options.js";

/**
 * For any number of emails, the names found under their commits.
 */
export type EmailsToNames = Record<string, string[]>;

export interface GitHubUsernameEmails {
	account: string | undefined;
	events: EmailsToNames;
}

export async function getGitHubUsernameEmails({
	auth,
	...rawOptions
}: GitHubUsernameEmailsOptions): Promise<GitHubUsernameEmails> {
	const octokit = await octokitFromAuth({ auth });

	const options = { ...defaultOptions, ...rawOptions };

	return {
		account: await getAccountEmail(octokit, options),
		events: await getEventsEmails(octokit, options),
	};
}
