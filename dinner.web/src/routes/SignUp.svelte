<script lang="ts">
	import StatusError from "$components/StatusError.svelte";
	import UserSignedIn from "$components/UserSignedIn.svelte";
	import { signUp, user } from "$providers/_index";
	import type { SignUpInput } from "$providers/_types";
	import { getCommandStore, isAppError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";

	let error: AppError;
	let message: string;

	let input: SignUpInput = {
		email: "",
		password: "",
		confirm_password: "",
	};

	const commandStore = getCommandStore();

	async function onSubmit() {
		const response = await signUp(commandStore, input);

		if (isAppError(response)) {
			error = response;
		} else {
			// will return the user, but does not change the auth state, requires email confirmation
			message = `Sign up submitted successfully. Please confirm at ${response.email}.`;
		}
	}
</script>

{#if $user == null}
	<h3>Sign Up</h3>

	<StatusError error="{error}" />

	<form on:submit|preventDefault="{onSubmit}">
		<input name="email" type="email" placeholder="email" bind:value="{input.email}" />
		<input
			name="password"
			type="password"
			placeholder="password"
			bind:value="{input.password}" />
		<input
			name="confirm_password"
			type="password"
			placeholder="confirm password"
			bind:value="{input.confirm_password}" />
		<button type="submit" disabled="{$commandStore.loading}">SIGN UP</button>
	</form>

	{#if message}
		<p>{message}</p>
	{/if}
{:else}
	<UserSignedIn />
{/if}
