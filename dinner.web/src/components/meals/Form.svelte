<script lang="ts">
	import type { GroceryEdit, MealEdit, TagEdit } from "$providers/_types";
	import { GroceryCategory } from "$providers/_types";
	import { createEventDispatcher } from "svelte";
	import GroceryAdd from "./GroceryAdd.svelte";
	import TagAdd from "./TagAdd.svelte";

	export let meal: MealEdit;
	export let tags: TagEdit[] = [];
	export let groceries: GroceryEdit[] = [];
	export let hasDelete: boolean = false;
	export let isBusy: boolean;

	const dispatch = createEventDispatcher();

	function onSave() {
		dispatch("save");
	}

	function onDelete() {
		dispatch("delete");
	}

	function onAddTag(e: CustomEvent<TagEdit>) {
		tags = [...tags, e.detail];
	}

	function onAddGrocery(e: CustomEvent<GroceryEdit>) {
		groceries = [...groceries, e.detail];
	}
</script>

<div>
	<button type="button" on:click="{onSave}" disabled="{isBusy}">SAVE</button>
	{#if hasDelete}
		<button type="button" on:click="{onDelete}" disabled="{isBusy}">DELETE</button>
	{/if}
</div>

<div>
	<label for="name">Name: </label>
	<input name="name" type="text" bind:value="{meal.name}" />
</div>
<div>
	<label for="notes">Notes: </label>
	<input name="notes" type="text" bind:value="{meal.notes}" />
</div>

<p>Tags</p>

<ul>
	{#each tags || [] as tag}
		<li>{tag.name}</li>
	{/each}
</ul>

<TagAdd on:addtag="{onAddTag}" />

{#each Object.values(GroceryCategory) as category}
	<p>{category}</p>

	<ul title="{category}">
		{#each groceries.filter((g) => g.category === category) as grocery}
			<li>{grocery.name}</li>
		{/each}
	</ul>

	<GroceryAdd category="{category}" on:addgrocery="{onAddGrocery}" />
{/each}
