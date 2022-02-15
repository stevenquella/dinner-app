<script lang="ts">
	import { getCommandStore } from "../lib/operations";
	import { signOut } from "./_users";

	const commandStore = getCommandStore();

	async function onSignOut() {
		await signOut(commandStore);
	}
</script>

<button type="input" disabled="{$commandStore.loading}" on:click="{onSignOut}">
	SIGN OUT
</button>
