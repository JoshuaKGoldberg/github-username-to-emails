import { Octokit } from "octokit";

import { getAccountEmail } from "./getAccountEmail.js";
import { getEventsEmails } from "./getEventsEmails.js";
import { GitHubUsernameEmailsOptions, defaultOptions } from "./options.js";

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
	auth ??= process.env.GH_TOKEN;
	if (!auth) {
		throw new Error(`Please provide an auth token (process.env.GH_TOKEN).`);
	}

	const octokit = new Octokit({ auth });
	const options = { ...defaultOptions, ...rawOptions };

	return {
		account: await getAccountEmail(octokit, options),
		events: await getEventsEmails(octokit, options),
	};
}
