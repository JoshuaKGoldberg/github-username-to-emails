import { describe, expect, test } from "vitest";

import { isEventWithCommits } from "./isEventWithCommits.js";

describe("isEventWithCommits", () => {
	test.each([
		[{ payload: {} }, false],
		[{ payload: { commits: {} } }, false],
		[{ payload: { commits: [] } }, true],
	] as const)("%s", (input, expected) => {
		expect(isEventWithCommits(input)).toBe(expected);
	});
});
