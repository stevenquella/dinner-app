<script lang="ts">
	import { signOut } from "$providers/_index";
	import { getCommandStore } from "$utilities/_index";

	const commandStore = getCommandStore();

	async function onSignOut() {
		await signOut(commandStore);
	}
</script>

<button type="input" disabled="{$commandStore.loading}" on:click="{onSignOut}"> SIGN OUT </button>
