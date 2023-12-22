import { Octokit } from "octokit";

import { EmailNamesStore } from "./EmailNamesStore.js";
import { isEventWithCommits } from "./isEventWithCommits.js";
import { FilledOutOptions } from "./options.js";

export async function getEventsEmails(
	octokit: Octokit,
	{
		historyLimit,
		username,
	}: Pick<FilledOutOptions, "historyLimit" | "username">,
) {
	const emailNames = new EmailNamesStore();

	// GitHub defaults to 30 results per page, and caps it at 100
	const resultsPerPage = Math.min(historyLimit, 100);
	let totalResults = 0;
	let page = 0;

	// TODO: Instead of paginating in series, look into using a parallel queue?
	while (totalResults < historyLimit) {
		const { data: events } = await octokit.request(
			"GET /users/{username}/events/public",
			{
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
				page,
				per_page: resultsPerPage,
				username,
			},
		);

		for (const event of events) {
			if (isEventWithCommits(event)) {
				for (const commit of event.payload.commits) {
					if (
						commit.author.email &&
						!commit.author.email.endsWith("@users.noreply.github.com")
					) {
						emailNames.add(commit.author.email, commit.author.name);
					}
				}
			}
		}

		if (events.length < resultsPerPage) {
			break;
		}

		totalResults += events.length;
		page += 1;
	}

	return emailNames.toEntries();
}
