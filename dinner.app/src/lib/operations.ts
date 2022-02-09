import type { Readable } from "svelte/store";
import { writable } from "svelte/store";

export type Operation = {
	loading: boolean;
};

export type CommandStore<TInput, TOutput> = Readable<Operation> & {
	execute: (input: TInput) => Promise<TOutput>;
};

/** construct command, execute to perform operation when desired */
export function command<TInput, TOutput>(
	op: (TInput) => Promise<TOutput>
): CommandStore<TInput, TOutput> {
	const { subscribe, set } = writable<Operation>({
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
