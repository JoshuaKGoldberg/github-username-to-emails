<h1 align="center">github-username-to-emails</h1>

<p align="center">
	Fetches any public emails associated with a GitHub username.
	📧
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/github-username-to-emails/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/github-username-to-emails" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/github-username-to-emails?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/github-username-to-emails/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/github-username-to-emails" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/github-username-to-emails?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

You can run this as a standalone command, or by its Node.js API.

### CLI

```shell
npx github-username-to-emails joshuakgoldberg
```

```plaintext
Account email: github@joshuakgoldberg.com
Event Email(s): 12
 - git@joshuakgoldberg.com, with names: Josh Goldberg, Josh Goldberg ✨
 - ...
```

### Node.js

```shell
npm i github-username-to-emails
```

```ts
import { getGitHubUsernameEmails } from "github-username-to-emails";

await getGitHubUsernameEmails({ username: "joshuakgoldberg" });

/*
{
  account: 'github@joshuakgoldberg.com',
  events: { 'git@joshuakgoldberg.com': [ 'Josh Goldberg ✨', 'Josh Goldberg' ] }
}
*/
```

Calling `getGitHubUsernameEmails` will try to find the user's email from two public data points:

- `account`: [`/users/${username}`](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user): public account information
- `events`: [`/users/{username}/events`](https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28#list-public-events-for-a-user): commits pushed by the user
  - This is stored as an object containing, under each email, the commit names associated with that email
  - Note that these may be commits originally authored by other users, _not_ the user you're looking for

Note that `account` might be `undefined` and `events` might be `{}`.
Only publicly visible emails can be retrieved.

### Options

`auth` is retrieved with [`octokit-from-auth`](https://github.com/JoshuaKGoldberg/octokit-from-auth), which defaults to `process.env.GH_TOKEN`, or failing that, [`gh auth token`](https://cli.github.com/manual/gh_auth_token).
If neither is available then an auth token must be provided as an option.

| Option         | Type     | Description                        | Default                                      |
| -------------- | -------- | ---------------------------------- | -------------------------------------------- |
| `auth`         | `string` | Auth token for Octokit REST calls. | `process.env.GH_TOKEN` or `$(gh auth token)` |
| `historyLimit` | `number` | How many public events to look at. | `500`                                        |
| `username`     | `string` | GitHub user to check emails of.    |                                              |

```ts
await getGitHubUsernameEmails({
	auth: "gho_abc123",
	historyLimit: 9001,
	username: "joshuakgoldberg",
});
```

## Email Privacy

This package doesn't expose any data users aren't already providing to GitHub.
You can manually check the same data it looks at on:

1. A user's public GitHub profile
2. `https://api.github.com/users/<username>/events`

This package only serves as a convenience to same time searching through that data.

To hide your email from public view, see [GitHub's _Setting your commit email address_ docs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address).

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 📧

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/github-username-to-emails/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/github-username-to-emails/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
