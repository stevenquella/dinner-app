<script lang="ts">
	import { getQueryStore } from "../lib/operations";
	import type { Meal } from "./_types";
	import { retrieveMeals } from "./_meals";
	import SignOut from "../users/SignOut.svelte";
	import QueryStatus from "../components/QueryStatus.svelte";

	const mealsStore = getQueryStore<Meal[]>();

	$: retrieveMeals(mealsStore);
</script>

<h3>Meals</h3>

<a href="#/meals/create">Create</a>

<QueryStatus query="{mealsStore}" />

{#each $mealsStore.result || [] as meal}
	<p>
		<a href="#/meals/{meal.id}">{meal.name}</a>
	</p>
{/each}

<SignOut />
