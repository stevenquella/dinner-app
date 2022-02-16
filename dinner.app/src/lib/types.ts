import type { Writable } from "svelte/store";

export type QueryOp<TOut> = {
	loading: boolean;
	error?: Error;
	result?: TOut;
};

export type QueryStore<TOut> = Writable<QueryOp<TOut>>;

export type CommandOp = {
	loading: boolean;
};

export type CommandStore = Writable<CommandOp>;

export type ValidationResult = {
	valid: boolean;
	errors: string[];
	message: string;
};
