#!/usr/bin/env node
import { githubUsernameToEmailsCli } from "../dist/cli/githubUsernameToEmailsCli.js";

await githubUsernameToEmailsCli(process.argv.slice(2));
