import type { Readable, Subscriber } from "svelte/store";
import { writable } from "svelte/store";

export type Operation = {
	loading: boolean;
};

export type QueryOperation<TOutput> = Operation & {
	error: any;
	result: TOutput;
};

export type QueryStore<TInput, TOutput> = Readable<QueryOperation<TOutput>> & {
	refetch: (input: TInput) => void;
};

export type CommandStore<TInput, TOutput> = Readable<Operation> & {
	execute: (input: TInput) => Promise<TOutput>;
};

/** construct query, will execute on first subscription */
export function query<TInput, TOutput>(
	op: (TInput) => Promise<TOutput>,
	input: TInput
): QueryStore<TInput, TOutput> {
	const { subscribe, set } = writable<QueryOperation<TOutput>>(
		{
			loading: true,
			error: null,
			result: null,
		},
		function (set) {
			executeQuery<TInput, TOutput>(op, input, set);
		}
	);

	return {
		subscribe,
		refetch: (input) => executeQuery(op, input, set),
	};
}

function executeQuery<TInput, TOutput>(
	op: (TInput: any) => Promise<TOutput>,
	input: TInput,
	set: Subscriber<QueryOperation<TOutput>>
): void {
	op(input)
		.then((result) => {
			set({
				loading: false,
				error: null,
				result: result,
			});
		})
		.catch((error) => {
			set({
				loading: false,
				error: error,
				result: null,
			});
		});
}

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
