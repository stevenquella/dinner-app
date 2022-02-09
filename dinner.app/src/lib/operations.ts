import type { PostgrestResponse } from "@supabase/supabase-js";
import type { Readable, Subscriber } from "svelte/store";
import { writable } from "svelte/store";

export type QueryOp<TOut> = {
	loading: boolean;
	error: any;
	result: TOut;
};

export type QueryStore<TIn, TOut> = Readable<QueryOp<TOut>> & {
	execute: (input: TIn) => Promise<void> | void;
};

export type CommandOp = {
	loading: boolean;
};

export type CommandStore<TIn, TOut> = Readable<CommandOp> & {
	execute: (input: TIn) => Promise<TOut>;
};

export function queryCollection<TIn, TOut>(
	op: (TIn) => Promise<PostgrestResponse<TOut>>
): QueryStore<TIn, TOut[]> {
	// initialize the store, execute to set stream of values and get single result
	const { subscribe, set } = writable<QueryOp<TOut[]>>({
		loading: false,
		error: null,
		result: null,
	});

	return {
		subscribe,
		execute: async function (input: TIn) {
			set({
				loading: true,
				error: null,
				result: null,
			});

			try {
				const response = await op(input);

				let error: string = "Unknown result.";
				let result: TOut[] = null;

				if (response.error != null) {
					error = response.error.message;
					result = null;
				} else if (response.data != null) {
					error = null;
					result = response.data;
				}

				set({
					loading: false,
					error: error,
					result: result,
				});
			} catch (error) {
				set({
					loading: false,
					error: error,
					result: null,
				});
			}
		},
	};
}

/** query the client expecting a single item, will return null if not a single item */
export function queryItem<TIn, TOut>(
	op: (TIn) => Promise<PostgrestResponse<TOut>>
): QueryStore<TIn, TOut> {
	// initialize the store, execute to set stream of values and get single result
	const { subscribe, set } = writable<QueryOp<TOut>>({
		loading: false,
		error: null,
		result: null,
	});

	return {
		subscribe,
		execute: async function (input: TIn) {
			set({
				loading: true,
				error: null,
				result: null,
			});

			try {
				const response = await op(input);

				let error: string = "Unknown result.";
				let result: TOut = null;

				if (response.error != null) {
					error = response.error.message;
					result = null;
				} else if (response.data != null) {
					if (response.data.length === 1) {
						error = null;
						result = response.data[0];
					} else {
						error = "Item not found.";
						result = null;
					}
				}

				set({
					loading: false,
					error: response?.error,
					result: result,
				});
			} catch (error) {
				set({
					loading: false,
					error: error,
					result: null,
				});
			}
		},
	};
}

/** construct command, execute to perform operation when desired */
export function command<TInput, TOutput>(
	op: (TInput) => Promise<TOutput>
): CommandStore<TInput, TOutput> {
	// initialize the store, execution to set stream of values
	const { subscribe, set } = writable<CommandOp>({
		loading: false,
	});

	return {
		subscribe,
		execute: async function (input: TInput) {
			set({
				loading: true,
			});

			const response: TOutput = await op(input);

			set({
				loading: false,
			});

			return response;
		},
	};
}

/** key checking on select statements */
export function buildColumns<T>(...columns: (keyof T)[]): string {
	return columns.join(",");
}
