<script lang="ts">
	import GroceryAdd from "$components/GroceryAdd.svelte";
	import InputDate from "$components/InputDate.svelte";
	import StatusError from "$components/StatusError.svelte";
	import StatusQuery from "$components/StatusQuery.svelte";
	import { retrieveMeals, upsertPlan } from "$providers/_index";
	import type { GroceryEdit, Meal, PlanEdit, PlanMealEdit } from "$providers/_types";
	import { GroceryCategory } from "$providers/_types";
	import { getCommandStore, getQueryStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";
	import { replace } from "svelte-spa-router";
	import { v4 as uuidv4 } from "uuid";

	const commandStore = getCommandStore();

	const mealsStore = getQueryStore<Meal[]>();

	let error: AppError;

	let plan: PlanEdit = {
		date: new Date(),
		notes: "",
	};

	let meals: PlanMealEdit[] = [];

	let groceries: GroceryEdit[] = [];

	async function onSave() {
		const response = await upsertPlan(commandStore, uuidv4(), plan, meals, groceries);

		if (isAppError(response)) {
			error = response;
		} else {
			replace("/");
		}
	}

	async function onAddMeal(id: string) {
		meals = [...meals, { meal_id: id }];
	}

	async function onAddGrocery(e: CustomEvent<GroceryEdit>) {
		groceries = [...groceries, e.detail];
	}

	$: console.log(plan);
	$: retrieveMeals(mealsStore);
</script>

<StatusError error="{error}" />

<InputDate bind:date="{plan.date}" />
<input name="notes" type="text" bind:value="{plan.notes}" />

{#each meals as meal}
	<p>{meal.meal_id}</p>
{/each}

<button type="button" on:click="{onSave}" disabled="{$commandStore.loading}"> SAVE </button>

<StatusQuery query="{mealsStore}" />

{#each $mealsStore.result || [] as meal}
	<p>
		<button type="button" on:click="{() => onAddMeal(meal.id)}">{meal.name}</button>
	</p>
{/each}

{#each Object.values(GroceryCategory) as category}
	<p>{category}</p>

	<ul title="{category}">
		{#each groceries.filter((g) => g.category === category) as grocery}
			<li>{grocery.name}</li>
		{/each}
	</ul>

	<GroceryAdd category="{category}" on:addgrocery="{onAddGrocery}" />
{/each}
