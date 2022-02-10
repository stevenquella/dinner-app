<script lang="ts">
	import Inputs from "./Inputs.svelte";
	import type { MealCreate } from "./_meals";
	import { createMeal } from "./_meals";
	import { replace } from "svelte-spa-router";
	import { getUser } from "../lib/client";

	const user = getUser();

	let inputs: MealCreate = {
		user_id: user.id,
		name: "",
		notes: "",
	};

	const mealCreate = createMeal();

	async function onSubmit() {
		const response = await mealCreate.execute(inputs);

		console.log(response);
		replace("/meals/");
	}
</script>

<p>Create Meal</p>

<form on:submit|preventDefault="{onSubmit}">
	<Inputs bind:inputs />
	<button type="submit" disabled="{$mealCreate.loading}">SAVE</button>
</form>
