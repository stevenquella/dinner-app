<script lang="ts">
	import SignedIn from "./SignedIn.svelte";

	import { user } from "../lib/client";
	import Credentials from "./Credentials.svelte";
	import type { SignInInput } from "./_types";
	import { signIn } from "./_users";
	import { getCommandStore } from "../lib/operations";

	let error: string;
	let input: SignInInput = {
		email: "",
		password: "",
	};

	const commandStore = getCommandStore();

	async function onSubmit(): Promise<void> {
		const response = await signIn(commandStore, input);
		if (response instanceof Error) {
			error = response.message;
		}
	}
</script>

{#if $user == null}
	<h3>Sign In</h3>

	<form on:submit|preventDefault="{onSubmit}">
		<Credentials bind:input />
		<button type="submit" disabled="{$commandStore.loading}"
			>SIGN IN</button>
	</form>

	<p>{error}</p>
{:else}
	<SignedIn />
{/if}
