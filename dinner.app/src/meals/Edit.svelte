<script lang="ts">
	import { onDestroy } from "svelte";
	import { MealEdit, retrieveMeal, updateMeal } from "./_meals";
	import QueryStatus from "../components/QueryStatus.svelte";
	import { replace } from "svelte-spa-router";
	import { getUser } from "../lib/client";
	import Inputs from "./Inputs.svelte";

	export let params: { id: string };

	const user = getUser();

	let inputs: MealEdit = {
		id: params.id,
		user_id: user.id,
		name: "",
		notes: "",
	};

	const meal = retrieveMeal();
	const mealUpdate = updateMeal();

	const unsubscribe = meal.subscribe((query) => {
		if (query.result != null) {
			inputs = {
				id: query.result.id,
				user_id: user.id,
				name: query.result.name,
				notes: query.result.notes,
			};
		}
	});

	$: meal.execute(params.id);

	async function onSubmit() {
		const response = await mealUpdate.execute(inputs);
		replace("/meals/");
	}

	onDestroy(unsubscribe);
</script>

<p>{params.id}</p>

<QueryStatus query="{meal}" />

{#if $meal.result}
	<p>{$meal.result.name}</p>

	<form on:submit|preventDefault="{onSubmit}">
		<Inputs bind:inputs />
		<button type="submit" disabled="{$mealUpdate.loading}">SAVE</button>
	</form>
{/if}
