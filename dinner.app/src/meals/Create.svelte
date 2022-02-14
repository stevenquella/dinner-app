<script lang="ts">
	import Inputs from "./Inputs.svelte";
	import type { MealCreate } from "./_meals";
	import { createMeal } from "./_meals";
	import { replace } from "svelte-spa-router";

	let inputs: MealCreate = {
		meal: {
			name: "",
			notes: "",
		},
		tags: [],
	};

	const mealCreate = createMeal();

	function onAddTag() {
		inputs.tags = [...inputs.tags, { name: "test" }];
	}

	async function onSubmit() {
		const response = await mealCreate.execute(inputs);
		if (response.error) {
			console.error(response.error);
		} else {
			replace("/meals/");
		}
	}
</script>

<p>Create Meal</p>

<form on:submit|preventDefault="{onSubmit}">
	<Inputs bind:inputs="{inputs.meal}" />
	<button type="submit" disabled="{$mealCreate.loading}">SAVE</button>
</form>

<p>Set Tags</p>

{#each inputs.tags as tag}
	<div>
		<p>{tag.name}</p>
	</div>
{/each}

<button type="input" on:click="{onAddTag}">ADD TAG</button>
