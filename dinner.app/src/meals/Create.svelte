<script lang="ts">
	import { replace } from "svelte-spa-router";
	import Error from "../components/Error.svelte";
	import type { AppError } from "../lib";
	import { getCommandStore, isAppError } from "../lib";
	import Inputs from "./Inputs.svelte";
	import { createMeal } from "./_meals";
	import type { MealEdit, TagEdit } from "./_types";

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
	<Inputs bind:inputs="{meal}" />
	<button type="submit" disabled="{$commandStore.loading}">SAVE</button>
</form>

<p>Set Tags</p>

{#each tags as tag}
	<div>
		<p>{tag.name}</p>
	</div>
{/each}

<button type="input" on:click="{onAddTag}">ADD TAG</button>
