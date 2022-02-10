<script lang="ts">
	import type { MealCreate, MealEdit } from "./_meals";

	export let inputs: { name: string; notes: string } = {
		name: "",
		notes: "",
	};
</script>

<div>
	<label for="name">Name: </label>
	<input name="name" type="text" bind:value="{inputs.name}" />
</div>
<div>
	<label for="notes">Notes: </label>
	<input name="notes" type="text" bind:value="{inputs.notes}" />
</div>
