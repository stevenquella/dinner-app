<script lang="ts">
	import MealForm from "$components/MealForm.svelte";
	import StatusError from "$components/StatusError.svelte";
	import { upsertMeal } from "$providers/_index";
	import type { GroceryEdit, MealEdit, TagEdit } from "$providers/_types";
	import { getCommandStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";
	import { replace } from "svelte-spa-router";
	import { v4 as uuidv4 } from "uuid";

	let error: AppError;

	let meal: MealEdit = {
		name: "",
		notes: "",
	};

	let tags: TagEdit[] = [];

	let groceries: GroceryEdit[] = [];

	const commandStore = getCommandStore();

	async function onSave() {
		const response = await upsertMeal(commandStore, uuidv4(), meal, tags, groceries);
		if (isAppError(response)) {
			error = response;
		} else {
			replace(`/meals/${response}`);
		}
	}
</script>

<h3>Create Meal</h3>

<StatusError error="{error}" />

<MealForm bind:meal bind:tags bind:groceries isBusy="{$commandStore.loading}" on:save="{onSave}" />
