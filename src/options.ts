export type FilledOutOptions = Required<
	Omit<GitHubUsernameEmailsOptions, "auth">
>;

export interface GitHubUsernameEmailsOptions {
	auth?: string;
	historyLimit?: number;
	username: string;
}

export const defaultOptions = {
	historyLimit: 500,
};
