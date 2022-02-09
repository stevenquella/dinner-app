<script lang="ts">
	import { retrieveMeal } from "./_meals";

	export let params: { id: string };

	const meal = retrieveMeal();
	$: meal.execute(params.id);
	//const unsubscribe = meal.subscribe((result) => console.log(result));
</script>

<p>{params.id}</p>

{#if $meal.loading}
	<p>Loading...</p>
{/if}

{#if $meal.error}
	<p>{$meal.error}</p>
{/if}

{#if $meal.result}
	<p>{$meal.result.name}</p>
{/if}
