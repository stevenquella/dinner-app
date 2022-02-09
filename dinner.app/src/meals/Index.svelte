<script lang="ts">
	import { client } from "../lib/client";
	import { query } from "../lib/operations";
	import SignOut from "../users/SignOut.svelte";

	type Meal = {
		id: string;
		updated_on: Date;
		name: string;
		notes: string;
	};

	async function retrieveMeals() {
		return await client.from<Meal>("meals").select("*");
	}

	const meals = query((_) => retrieveMeals(), null);

	function onRefresh() {
		meals.refetch(null);
	}
</script>

<p>Meals index.</p>

<button on:click="{onRefresh}">Refresh</button>

{#if $meals.loading}
	<p>Loading...</p>
{/if}

{#each $meals.result?.data || [] as meal}
	<p>{meal.name}</p>
{/each}

<SignOut />
