#!/usr/bin/env node
import { githubUsernameToEmailsCli } from "../lib/cli/githubUsernameToEmailsCli.js";

await githubUsernameToEmailsCli(process.argv.slice(2));
