import { getGitHubUsernameEmails } from "../getGitHubUsernameEmails.js";

export async function githubUsernameToEmailsCli(args: string[]) {
	if (args.length !== 1) {
		throw new Error(
			"Provide exactly one username, like `npx github-username-to-emails joshuakgoldberg`",
		);
	}

	const [username] = args;
	const result = await getGitHubUsernameEmails({ username });

	console.log(`Account email: ${result.account ?? "None found..."}`);

	const events = Object.entries(result.events);

	console.log(`Event Email(s): ${events.length ?? "None found..."}`);

	for (const [email, names] of events) {
		console.log(` - ${email}, with names: ${names.join(", ")}`);
	}
}
