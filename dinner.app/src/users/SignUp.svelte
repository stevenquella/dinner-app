<script lang="ts">
	import Error from "../components/Error.svelte";
	import type { AppError } from "../lib";
	import { getCommandStore, isAppError, user } from "../lib";
	import Credentials from "./Credentials.svelte";
	import SignedIn from "./SignedIn.svelte";
	import type { SignUpInput } from "./_types";
	import { signUp } from "./_users";

	let error: AppError;
	let message: string;

	let input: SignUpInput = {
		email: "",
		password: "",
		confirm_password: "", // TODO
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

	<Error error="{error}" />

	<form on:submit|preventDefault="{onSubmit}">
		<Credentials bind:input />
		<input
			name="confirm_password"
			type="password"
			placeholder="confirm password"
			bind:value="{input.confirm_password}" />
		<button type="submit" disabled="{$commandStore.loading}"
			>SIGN UP</button>
	</form>

	{#if message}
		<p>{message}</p>
	{/if}
{:else}
	<SignedIn />
{/if}
