import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: ["src/index.ts", "src/cli/githubUsernameToEmailsCli.ts"],
	fixedExtension: false,
	unbundle: true,
});
