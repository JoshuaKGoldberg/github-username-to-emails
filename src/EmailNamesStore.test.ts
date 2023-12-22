import { describe, expect, it } from "vitest";

import { EmailNamesStore } from "./EmailNamesStore.js";

describe("EmailNamesStore", () => {
	it("produces no entries when no emails were added", () => {
		const store = new EmailNamesStore();

		const actual = store.toEntries();

		expect(actual).toEqual({});
	});

	it("stores emails by name when emails are added with names", () => {
		const store = new EmailNamesStore();
		const email1 = "abc-1@test.com";
		const email2 = "abc-2@test.com";
		const name1 = "Abc 123 1";
		const name2 = "Abc 123 2";

		store.add(email1, name1);
		store.add(email2, name2);

		const actual = store.toEntries();

		expect(actual).toEqual({ [email1]: [name1], [email2]: [name2] });
	});

	it("deduplicates emails by name when emails are added with name multiple times", () => {
		const store = new EmailNamesStore();
		const email = "abc@test.com";
		const name = "Abc 123";

		store.add(email, name);
		store.add(email, name);

		const actual = store.toEntries();

		expect(actual).toEqual({ [email]: [name] });
	});

	it("stores emails without name when emails are added without name", () => {
		const store = new EmailNamesStore();
		const email = "abc@test.com";

		store.add(email, undefined);

		const actual = store.toEntries();

		expect(actual).toEqual({ [email]: [] });
	});

	it("deduplicates emails by name when emails are added with and without name", () => {
		const store = new EmailNamesStore();
		const email = "abc@test.com";
		const name = "Abc 123";

		store.add(email, undefined);
		store.add(email, name);

		const actual = store.toEntries();

		expect(actual).toEqual({ [email]: [name] });
	});
});
