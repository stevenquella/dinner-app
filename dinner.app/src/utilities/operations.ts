import type { PostgrestResponse } from "@supabase/supabase-js";
import { writable } from "svelte/store";
import type { CommandOp, CommandStore, QueryOp, QueryStore } from "./_types";

export function getQueryStore<T>(): QueryStore<T> {
	return writable<QueryOp<T>>({ loading: true });
}

export async function query<T>(store: QueryStore<T>, operation: () => Promise<T>): Promise<void> {
	store.set({ loading: true });

	try {
		const result: T = await operation();
		store.set({ loading: false, result });
	} catch (error) {
		store.set({ loading: false, error: error as Error });
	}
}

export function getCommandStore() {
	return writable<CommandOp>({ loading: false });
}

export async function command<T>(
	store: CommandStore,
	operation: () => Promise<T>
): Promise<T | Error> {
	store.set({ loading: true });

	let response: T | Error;
	try {
		response = await operation();
	} catch (error) {
		response = error as Error;
	} finally {
		store.set({ loading: false });
	}

	return response;
}

/** Simplify postgrest response, assuming single item. (use throwOnError) */
export function single<T>(response: PostgrestResponse<T>): T {
	let result: T = null;

	if (response.data && response.data.length === 1) {
		result = response.data[0];
	}

	return result;
}
