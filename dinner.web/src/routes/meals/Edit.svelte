<script lang="ts">
	import { MealForm, StatusError, StatusQuery } from "$components/_Index.svelte";
	import { deleteMeal, retrieveMeal, upsertMeal } from "$providers/_index";
	import type { GroceryEdit, Meal, MealEdit, TagEdit } from "$providers/_types";
	import { getCommandStore, getQueryStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";
	import { onDestroy } from "svelte";
	import { replace } from "svelte-spa-router";
	import { slide } from "svelte/transition";

	export let params: { id: string };

	let error: AppError;

	let meal: MealEdit = {
		name: "",
		notes: "",
	};

	let tags: TagEdit[] = [];

	let groceries: GroceryEdit[] = [];

	const mealStore = getQueryStore<Meal>();
	const commandStore = getCommandStore();

	const unsubscribe = mealStore.subscribe((query) => {
		if (query.result != null) {
			meal = {
				name: query.result.name,
				notes: query.result.notes,
			};
			tags = query.result.tags.map((t) => ({
				name: t.name,
			}));
			groceries = query.result.groceries.map((g) => ({
				category: g.category,
				name: g.name,
			}));
		}
	});

	$: retrieveMeal(mealStore, params.id);

	async function onSave() {
		const response = await upsertMeal(commandStore, params.id, meal, tags, groceries);
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

<div transition:slide>
	<p>{params.id}</p>

	<StatusQuery query="{mealStore}" />

	<StatusError error="{error}" />

	{#if $mealStore.result}
		<p>{$mealStore.result.name}</p>

		<MealForm
			bind:meal
			bind:tags
			bind:groceries
			isBusy="{$commandStore.loading}"
			on:save="{onSave}"
			hasDelete="{true}"
			on:delete="{onDelete}" />
	{/if}
</div>
