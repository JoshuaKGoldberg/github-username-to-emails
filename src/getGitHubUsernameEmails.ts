import { getGitHubAuthToken } from "get-github-auth-token";
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

async function retrieveAuth(provided: string | undefined) {
	if (provided === "") {
		throw new Error("Invalid auth provided: an empty string ('').");
	}

	const auth = await getGitHubAuthToken();
	if (auth.succeeded) {
		return auth.token;
	}

	throw new Error(
		"Please provide an auth token (process.env.GH_TOKEN) or log in with the GitHub CLI (gh).",
		{
			cause: auth.error,
		},
	);
}

export async function getGitHubUsernameEmails({
	auth: providedAuth,
	...rawOptions
}: GitHubUsernameEmailsOptions): Promise<GitHubUsernameEmails> {
	const auth = await retrieveAuth(providedAuth);

	const octokit = new Octokit({ auth });
	const options = { ...defaultOptions, ...rawOptions };

	return {
		account: await getAccountEmail(octokit, options),
		events: await getEventsEmails(octokit, options),
	};
}
