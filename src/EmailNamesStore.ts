export class EmailNamesStore {
	#emailNames = new Map<string, Set<string>>();

	add(email: string, name: string | undefined) {
		const names = this.#getNames(email);

		if (name) {
			names.add(name);
		}
	}

	toEntries() {
		return Object.fromEntries(
			Array.from(this.#emailNames).map(([key, value]) => [
				key,
				Array.from(value),
			]),
		);
	}

	#getNames(email: string) {
		const existing = this.#emailNames.get(email);
		if (existing) {
			return existing;
		}

		const created = new Set<string>();

		this.#emailNames.set(email, created);

		return created;
	}
}
