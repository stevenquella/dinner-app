<script lang="ts">
	import QueryStatus from "$components/QueryStatus.svelte";
	import { retrieveMeals } from "$providers/_index";
	import type { Meal } from "$providers/_types";
	import SignOut from "$routes/SignOut.svelte";
	import { getQueryStore } from "$utilities/_index";

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
