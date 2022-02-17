<script lang="ts">
	import SignedIn from "./SignedIn.svelte";
	import { user } from "../lib/client";
	import Credentials from "./Credentials.svelte";
	import type { SignInInput } from "./_types";
	import { signIn } from "./_users";
	import { getCommandStore } from "../lib/operations";
	import { isAppError } from "../lib/errors";
	import type { AppError } from "../lib/errors";
	import Error from "../components/Error.svelte";

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
		<Credentials bind:input />
		<button type="submit" disabled="{$commandStore.loading}"
			>SIGN IN</button>
	</form>

	<p>{error}</p>
{:else}
	<SignedIn />
{/if}
