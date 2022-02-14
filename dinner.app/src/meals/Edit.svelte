<script lang="ts">
	import { onDestroy } from "svelte";
	import { deleteMeal, MealEdit, retrieveMeal, updateMeal } from "./_meals";
	import QueryStatus from "../components/QueryStatus.svelte";
	import { replace } from "svelte-spa-router";
	import Inputs from "./Inputs.svelte";

	export let params: { id: string };

	let inputs: MealEdit = {
		meal: {
			id: params.id,
			name: "",
			notes: "",
		},
		tags: [],
	};
	const meal = retrieveMeal();
	const mealUpdate = updateMeal();
	const mealDelete = deleteMeal();

	const unsubscribe = meal.subscribe((query) => {
		if (query.result != null) {
			inputs.meal = {
				id: query.result.id,
				name: query.result.name,
				notes: query.result.notes,
			};
		}
	});

	$: meal.execute(params.id);

	async function onSubmit() {
		const response = await mealUpdate.execute(inputs);

		if (response.error) {
			console.error(response.error);
		} else {
			replace("/meals/");
		}
	}

	async function onDelete() {
		const response = await mealDelete.execute(params.id);
		if (response.error) {
			console.error(response.error);
		} else {
			replace("/meals/");
		}
	}

	onDestroy(unsubscribe);
</script>

<p>{params.id}</p>

<QueryStatus query="{meal}" />

{#if $meal.result}
	<p>{$meal.result.name}</p>

	<form on:submit|preventDefault="{onSubmit}">
		<Inputs bind:inputs="{inputs.meal}" />
		<button
			type="submit"
			disabled="{$mealUpdate.loading || $mealDelete.loading}"
			>SAVE</button>
	</form>

	<button
		on:click="{onDelete}"
		type="input"
		disabled="{$mealUpdate.loading || $mealDelete.loading}">
		DELETE
	</button>
{/if}
