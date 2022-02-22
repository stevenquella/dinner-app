<script lang="ts">
	import StatusError from "$components/StatusError.svelte";
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

<StatusError error="{error}" />

<button type="button" disabled="{$commandStore.loading}" on:click="{onSignOut}"> SIGN OUT </button>
