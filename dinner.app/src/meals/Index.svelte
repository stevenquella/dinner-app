<script lang="ts">
	import { retrieveMeals } from "./_meals";
	import SignOut from "../users/SignOut.svelte";

	const meals = retrieveMeals();
	meals.execute(null);

	function onRefresh() {
		meals.execute(null);
	}
</script>

<p>Meals index.</p>

<button on:click="{onRefresh}">Refresh</button>

{#if $meals.loading}
	<p>Loading...</p>
{/if}

{#if $meals.error}
	<p>{$meals.error}</p>
{/if}

{#each $meals.result || [] as meal}
	<p>
		<a href="#/meals/{meal.id}">{meal.name}</a>
	</p>
{/each}

<SignOut />
