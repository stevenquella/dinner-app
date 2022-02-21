<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let category: string;
	let name: string;
	const dispatch = createEventDispatcher();

	function onAddGrocery() {
		dispatch("addgrocery", {
			category,
			name,
		});

		name = "";
	}
</script>

<div>
	<input name="grocery_{category}" type="text" bind:value="{name}" />
	<button type="button" on:click="{onAddGrocery}">ADD GROCERY</button>
</div>
