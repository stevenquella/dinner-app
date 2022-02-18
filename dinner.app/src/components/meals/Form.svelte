<script lang="ts">
	import type { MealEdit, TagEdit } from "$providers/_types";
	import { createEventDispatcher } from "svelte";

	export let meal: MealEdit;
	export let tags: TagEdit[];
	export let hasDelete: boolean = false;
	export let isBusy: boolean;

	let newTag: string;

	const dispatch = createEventDispatcher();

	function onSave() {
		dispatch("save");
	}

	function onDelete() {
		dispatch("delete");
	}

	function onAddTag() {
		tags = [...tags, { name: newTag }];
		newTag = "";
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

<ul>
	{#each tags || [] as tag}
		<li>{tag.name}</li>
	{/each}
</ul>

<div>
	<input name="tag" type="text" bind:value="{newTag}" />
	<button type="button" on:click="{onAddTag}">ADD TAG</button>
</div>
