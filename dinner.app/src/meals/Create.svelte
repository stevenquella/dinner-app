<script lang="ts">
	import Inputs from "./Inputs.svelte";
	import { createMeal } from "./_meals";
	import { getCommandStore } from "../lib/operations";
	import { replace } from "svelte-spa-router";
	import type { MealEdit, TagEdit } from "./_types";

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
		await createMeal(commandStore, meal, tags);
		replace("/meals/");
	}
</script>

<p>Create Meal</p>

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
