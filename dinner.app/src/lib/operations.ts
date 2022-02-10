import type { PostgrestResponse } from "@supabase/supabase-js";
import type { Readable } from "svelte/store";
import { writable } from "svelte/store";

export type QueryOp<TOut> = {
	loading: boolean;
	error?: any;
	result?: TOut;
};

export type QueryStore<TIn, TOut> = Readable<QueryOp<TOut>> & {
	execute: (input: TIn) => Promise<void> | void;
};

export type CommandOp = {
	loading: boolean;
};

export type CommandStore<TIn, TOut> = Readable<CommandOp> & {
	execute: (input: TIn) => Promise<CommandResult<TOut>>;
};

export type CommandResult<TOut> = {
	error?: any;
	result?: TOut;
};

/** query the client expecting a collection */
export function queryCollection<TIn, TOut>(
	op: (TIn) => Promise<PostgrestResponse<TOut>>
): QueryStore<TIn, TOut[]> {
	// initialize the store, execute to set stream of values and get single result
	const { subscribe, set } = writable<QueryOp<TOut[]>>({ loading: false });

	return {
		subscribe,
		execute: async function (input: TIn) {
			set({ loading: true });

			try {
				const response = await op(input);
				set({
					loading: false,
					...translatePostgrestResponse(response),
				});
			} catch (error) {
				set({ loading: false, error });
			}
		},
	};
}

/** query the client expecting a single item, will return null if not a single item */
export function queryItem<TIn, TOut>(
	op: (TIn) => Promise<PostgrestResponse<TOut>>
): QueryStore<TIn, TOut> {
	// initialize the store, execute to set stream of values and get single result
	const { subscribe, set } = writable<QueryOp<TOut>>({ loading: false });

	return {
		subscribe,
		execute: async function (input: TIn) {
			set({ loading: true });

			try {
				const response = await op(input);
				set({
					loading: false,
					...translatePostgrestResponseItem(response),
				});
			} catch (error) {
				set({ loading: false, error: error });
			}
		},
	};
}

/** command with the client assuming with a single item */
export function commandItem<TIn, TOut>(
	op: (TIn) => Promise<PostgrestResponse<TOut>>
): CommandStore<TIn, TOut> {
	// initialize the store, execution to set stream of values
	const { subscribe, set } = writable<CommandOp>({ loading: false });

	return {
		subscribe,
		execute: async function (input: TIn) {
			set({ loading: true });

			try {
				const response = await op(input);
				set({ loading: false });
				return translatePostgrestResponseItem(response);
			} catch (error) {
				set({ loading: false });
				return { error: error, result: null };
			}
		},
	};
}

/** generic command */
export function command<TInput, TOutput>(
	op: (TInput) => Promise<TOutput>
): CommandStore<TInput, TOutput> {
	// initialize the store, execution to set stream of values
	const { subscribe, set } = writable<CommandOp>({ loading: false });

	return {
		subscribe,
		execute: async function (input: TInput) {
			set({ loading: true });
			const response: TOutput = await op(input);

			set({ loading: false });
			return response;
		},
	};
}

/** key checking on select statements */
export function buildColumns<T>(...columns: (keyof T)[]): string {
	return columns.join(",");
}

/** Simplify postgrest response, assuming collection. */
function translatePostgrestResponse<T>(response: PostgrestResponse<T>): {
	error: any;
	result: T[];
} {
	let error: string = "Unknown result.";
	let result: T[] = [];

	if (response.error != null) {
		error = response.error.message;
		result = null;
	} else if (response.data != null) {
		error = null;
		result = response.data;
	}

	return {
		error,
		result,
	};
}

/** Simplify postgrest response, assuming single item. */
function translatePostgrestResponseItem<T>(response: PostgrestResponse<T>): {
	error: any;
	result: T;
} {
	let error: string = "Unknown result.";
	let result: T = null;

	if (response.error != null) {
		error = response.error.message;
		result = null;
	} else if (response.data != null && response.data.length === 1) {
		error = null;
		result = response.data[0];
	}

	return {
		error,
		result,
	};
}
