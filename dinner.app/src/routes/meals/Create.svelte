<script lang="ts">
	import Error from "$components/Error.svelte";
	import MealForm from "$components/meals/Form.svelte";
	import { createMeal } from "$providers/_index";
	import type { MealEdit, TagEdit } from "$providers/_types";
	import { getCommandStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";
	import { replace } from "svelte-spa-router";

	let error: AppError;

	let meal: MealEdit = {
		name: "",
		notes: "",
	};

	let tags: TagEdit[] = [];

	const commandStore = getCommandStore();

	async function onSave() {
		const response = await createMeal(commandStore, meal, tags);
		if (isAppError(response)) {
			error = response;
		} else {
			replace(`/meals/${response}`);
		}
	}
</script>

<h3>Create Meal</h3>

<Error error="{error}" />

<MealForm bind:meal bind:tags isBusy="{$commandStore.loading}" on:save="{onSave}" />
