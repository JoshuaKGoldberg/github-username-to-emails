import { Octokit } from "octokit";

import { EmailNamesStore } from "./EmailNamesStore.js";
import { FilledOutOptions } from "./options.js";

// GitHub's search API only ever provides the first 1,000 results
const maxSearchResults = 1000;

export async function getCommitsEmails(
	octokit: Octokit,
	{
		historyLimit,
		username,
	}: Pick<FilledOutOptions, "historyLimit" | "username">,
) {
	const emailNames = new EmailNamesStore();
	const limit = Math.min(historyLimit, maxSearchResults);
	let totalResults = 0;

	// octokit.paginate follows the response's Link header until there are no
	// more pages, or until we've seen enough commits and call done().
	// Search requests are throttled by Octokit to one at a time, per GitHub's
	// rate limit guidance, so this is intentionally not parallelized.
	const commits = await octokit.paginate(
		"GET /search/commits",
		{
			// GitHub defaults to 30 results per page, and caps it at 100
			per_page: Math.min(limit, 100),
			q: `author:${username}`,
			sort: "author-date",
		},
		(response, done) => {
			totalResults += response.data.length;

			if (totalResults >= limit) {
				done();
			}

			return response.data;
		},
	);

	for (const { commit } of commits.slice(0, limit)) {
		if (
			commit.author.email &&
			!commit.author.email.endsWith("@users.noreply.github.com")
		) {
			emailNames.add(commit.author.email, commit.author.name);
		}
	}

	return emailNames.toEntries();
}
