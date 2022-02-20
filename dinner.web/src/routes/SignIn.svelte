<script lang="ts">
	import Error from "$components/Error.svelte";
	import SignedIn from "$components/users/SignedIn.svelte";
	import { signIn, user } from "$providers/_index";
	import type { SignInInput } from "$providers/_types";
	import { getCommandStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";

	let error: AppError;
	let input: SignInInput = {
		email: "",
		password: "",
	};

	const commandStore = getCommandStore();

	async function onSubmit(): Promise<void> {
		const response = await signIn(commandStore, input);
		if (isAppError(response)) {
			error = response;
		}
	}
</script>

{#if $user == null}
	<h3>Sign In</h3>

	<Error error="{error}" />

	<form on:submit|preventDefault="{onSubmit}">
		<input name="email" type="email" placeholder="email" bind:value="{input.email}" />
		<input
			name="password"
			type="password"
			placeholder="password"
			bind:value="{input.password}" />
		<button type="submit" disabled="{$commandStore.loading}">SIGN IN</button>
	</form>

	<p>{error}</p>
{:else}
	<SignedIn />
{/if}
