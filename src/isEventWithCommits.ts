export interface CommitAuthor {
	email?: string;
	name?: string;
}

export interface EventCommit {
	author: CommitAuthor;
}

export interface EventWithCommits {
	payload: PayloadWithCommits;
}

export interface PayloadWithCommits {
	commits: EventCommit[];
}

export function isEventWithCommits(event: {
	payload: object;
}): event is EventWithCommits {
	return (
		"payload" in event &&
		"commits" in event.payload &&
		Array.isArray(event.payload.commits)
	);
}
