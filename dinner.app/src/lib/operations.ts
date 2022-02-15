import type { PostgrestResponse } from "@supabase/supabase-js";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

// TODO - pull these into a types file
export type QueryOp<TOut> = {
	loading: boolean;
	error?: any;
	result?: TOut;
};

export type QueryStore<TOut> = Writable<QueryOp<TOut>>;

export type CommandOp = {
	loading: boolean;
};

export type CommandStore = Writable<CommandOp>;

export function getQueryStore<T>(): QueryStore<T> {
	return writable<QueryOp<T>>({ loading: true });
}

export async function query<T>(
	store: QueryStore<T>,
	operation: () => Promise<T>
) {
	store.set({ loading: true });

	try {
		const result: T = await operation();
		store.set({ loading: false, result });
	} catch (error) {
		store.set({ loading: false, error });
	}
}

export function getCommandStore() {
	return writable<CommandOp>({ loading: false });
}

export async function command<T>(
	store: CommandStore,
	operation: () => Promise<T>
) {
	store.set({ loading: true });

	let response: T;
	try {
		response = await operation();
	} catch (error) {
		console.debug(error);
	} finally {
		store.set({ loading: false });
	}

	return response;
}

/** Simplify postgrest response, assuming single item. (use throwOnError) */
export function single<T>(response: PostgrestResponse<T>): T {
	let result: T = null;

	if (response.data != null && response.data.length === 1) {
		result = response.data[0];
	}

	return result;
}
