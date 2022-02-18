<script lang="ts">
	import Error from "$components/Error.svelte";
	import QueryStatus from "$components/QueryStatus.svelte";
	import { deleteMeal, retrieveMeal, updateMeal } from "$providers/_index";
	import type { Meal, MealEdit, TagEdit } from "$providers/_types";
	import { getCommandStore, getQueryStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";
	import { onDestroy } from "svelte";
	import { replace } from "svelte-spa-router";

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
		<div>
			<label for="name">Name: </label>
			<input name="name" type="text" bind:value="{meal.name}" />
		</div>
		<div>
			<label for="notes">Notes: </label>
			<input name="notes" type="text" bind:value="{meal.notes}" />
		</div>
		<button type="submit" disabled="{$commandStore.loading}">SAVE</button>
	</form>

	<button on:click="{onDelete}" type="input" disabled="{$commandStore.loading}"> DELETE </button>
{/if}
