<script lang="ts">
	import Error from "$components/Error.svelte";
	import { createMeal } from "$providers/_index";
	import type { MealEdit, TagEdit } from "$providers/_types";
	import { getCommandStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";
	import { replace } from "svelte-spa-router";

	let error: AppError;

	let meal: MealEdit = {
		name: "",
		notes: "",
	};

	let tags: TagEdit[] = [];

	const commandStore = getCommandStore();

	function onAddTag() {
		tags = [...tags, { name: "test" }];
	}

	async function onSubmit() {
		const response = await createMeal(commandStore, meal, tags);
		if (isAppError(response)) {
			error = response;
		} else {
			replace("/meals/");
		}
	}
</script>

<p>Create Meal</p>

<Error error="{error}" />

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

<p>Set Tags</p>

{#each tags as tag}
	<div>
		<p>{tag.name}</p>
	</div>
{/each}

<button type="input" on:click="{onAddTag}">ADD TAG</button>
