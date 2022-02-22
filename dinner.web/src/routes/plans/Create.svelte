<script lang="ts">
	import Error from "$components/StatusError.svelte";
	import { upsertPlan } from "$providers/plans";
	import type { PlanEdit } from "$providers/_types";
	import { isAppError } from "$utilities/errors";
	import { getCommandStore } from "$utilities/operations";
	import type { AppError } from "$utilities/_types";
	import { v4 as uuidv4 } from "uuid";

	const commandStore = getCommandStore();

	let error: AppError;

	let inputs: PlanEdit = {
		date: new Date(),
		notes: "",
	};

	async function onSave() {
		const response = await upsertPlan(commandStore, uuidv4(), inputs);

		if (isAppError(response)) {
			error = response;
		}
	}
</script>

<Error error="{error}" />

<input name="date" type="date" bind:value="{inputs.date}" />
<input name="notes" type="text" bind:value="{inputs.notes}" />

<button type="button" on:click="{onSave}"> SAVE </button>
