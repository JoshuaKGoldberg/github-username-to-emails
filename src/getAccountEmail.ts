import { Octokit } from "octokit";

import { FilledOutOptions } from "./options.js";

export async function getAccountEmail(
	octokit: Octokit,
	{ username }: Pick<FilledOutOptions, "username">,
) {
	const { data } = await octokit.request("GET /users/{username}", {
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
		username,
	});

	return data.email ?? undefined;
}
