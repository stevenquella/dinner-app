<script lang="ts">
	import { StatusQuery } from "$components/_Index.svelte";
	import { retrieveMeals } from "$providers/_index";
	import type { Meal } from "$providers/_types";
	import SignOut from "$routes/SignOut.svelte";
	import { getQueryStore } from "$utilities/_index";

	const mealsStore = getQueryStore<Meal[]>();

	$: retrieveMeals(mealsStore);
</script>

<h3>Meals</h3>

<a href="#/meals/create">Create</a>
<a href="#/plans/create">Create Plan</a>

<StatusQuery query="{mealsStore}" />

{#each $mealsStore.result || [] as meal}
	<p>
		<a href="#/meals/{meal.id}">{meal.name}</a>
	</p>
{/each}

<SignOut />
