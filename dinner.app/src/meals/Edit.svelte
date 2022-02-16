<script lang="ts">
	import { onDestroy } from "svelte";
	import type { Meal, MealEdit, TagEdit } from "./_types";
	import { deleteMeal, retrieveMeal, updateMeal } from "./_meals";
	import QueryStatus from "../components/QueryStatus.svelte";
	import { replace } from "svelte-spa-router";
	import Inputs from "./Inputs.svelte";
	import { getCommandStore, getQueryStore } from "../lib/operations";
	import type { AppError } from "../lib/errors";
	import { isAppError } from "../lib/errors";
	import Error from "../components/Error.svelte";

	export let params: { id: string };

	let error: AppError;

	let meal: MealEdit = {
		name: "",
		notes: "",
	};

	let tags: TagEdit[] = [];

	const mealStore = getQueryStore<Meal>();
	const commandStore = getCommandStore();

	const unsubscribe = mealStore.subscribe((query) => {
		if (query.result != null) {
			meal = {
				name: query.result.name,
				notes: query.result.notes,
			};
			tags = query.result.tags;
		}
	});

	$: retrieveMeal(mealStore, params.id);

	async function onSubmit() {
		const response = await updateMeal(commandStore, params.id, meal, tags);
		if (isAppError(response)) {
			error = response;
		} else {
			replace("/meals/");
		}
	}

	async function onDelete() {
		const response = await deleteMeal(commandStore, params.id);
		if (isAppError(response)) {
			error = response;
		} else {
			replace("/meals/");
		}
	}

	onDestroy(unsubscribe);
</script>

<p>{params.id}</p>

<QueryStatus query="{mealStore}" />

<Error error="{error}" />

{#if $mealStore.result}
	<p>{$mealStore.result.name}</p>

	<form on:submit|preventDefault="{onSubmit}">
		<Inputs bind:inputs="{meal}" />
		<button type="submit" disabled="{$commandStore.loading}">SAVE</button>
	</form>

	<button
		on:click="{onDelete}"
		type="input"
		disabled="{$commandStore.loading}">
		DELETE
	</button>
{/if}
