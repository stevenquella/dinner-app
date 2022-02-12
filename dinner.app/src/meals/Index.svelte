<script lang="ts">
	import { retrieveMeals } from "./_meals";
	import SignOut from "../users/SignOut.svelte";
	import QueryStatus from "../components/QueryStatus.svelte";

	const meals = retrieveMeals();
	meals.execute(null);

	function onRefresh() {
		meals.execute(null);
	}
</script>

<p>Meals index.</p>

<a href="#/meals/create">Create</a>
<button on:click="{onRefresh}">Refresh</button>

<QueryStatus query="{meals}" />

{#each $meals.result || [] as meal}
	<p>
		<a href="#/meals/{meal.id}">{meal.name}</a>
	</p>
{/each}

<SignOut />
