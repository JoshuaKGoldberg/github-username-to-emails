export interface GitHubUsernameEmailsOptions {
	auth?: string;
	historyLimit?: number;
	username: string;
}

export type FilledOutOptions = Required<
	Omit<GitHubUsernameEmailsOptions, "auth">
>;

export const defaultOptions = {
	historyLimit: 500,
};
