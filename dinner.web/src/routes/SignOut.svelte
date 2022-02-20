<script lang="ts">
	import Error from "$components/Error.svelte";
	import { signOut } from "$providers/_index";
	import { getCommandStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";

	let error: AppError;

	const commandStore = getCommandStore();

	async function onSignOut() {
		const response = await signOut(commandStore);
		if (isAppError(response)) {
			error = response;
		}
	}
</script>

<Error error="{error}" />

<button type="button" disabled="{$commandStore.loading}" on:click="{onSignOut}"> SIGN OUT </button>
