<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
	let name: string;

	function onAddTag() {
		dispatch("addtag", {
			name,
		});

		name = "";
	}
</script>

<div>
	<input name="tag" type="text" bind:value="{name}" />
	<button type="button" on:click="{onAddTag}">ADD TAG</button>
</div>
