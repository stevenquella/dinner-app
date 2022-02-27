<script lang="ts">
	import InputDate from "$components/InputDate.svelte";
	import StatusError from "$components/StatusError.svelte";
	import { upsertPlan } from "$providers/plans";
	import type { PlanEdit } from "$providers/_types";
	import { isAppError } from "$utilities/errors";
	import { getCommandStore } from "$utilities/operations";
	import type { AppError } from "$utilities/_types";
	import { replace } from "svelte-spa-router";
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
		} else {
			replace("/");
		}
	}

	$: console.log(inputs);
</script>

<StatusError error="{error}" />

<InputDate bind:date="{inputs.date}" />
<input name="notes" type="text" bind:value="{inputs.notes}" />

<button type="button" on:click="{onSave}" disabled="{$commandStore.loading}"> SAVE </button>
