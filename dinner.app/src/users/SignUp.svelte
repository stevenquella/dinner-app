<script lang="ts">
	import { user } from "../lib/client";
	import { signUp } from "./_users";
	import Credentials from "./Credentials.svelte";
	import SignedIn from "./SignedIn.svelte";
	import type { SignUpInput } from "./_types";
	import { getCommandStore } from "../lib/operations";

	let message: string;
	let input: SignUpInput = {
		email: "",
		password: "",
		confirm_password: "", // TODO
	};

	const commandStore = getCommandStore();

	async function onSubmit() {
		const response = await signUp(commandStore, input);

		// TODO - this should probably be in _users.ts
		// will return the user, but does not change the auth state, requires email confirmation
		if (response.error) {
			message = response.error.message;
		} else if (response.user) {
			message = `Sign up submitted successfully. Please confirm at ${response.user.email}.`;
		} else {
			console.debug(response);
			message = "Unknown result. Please try again.";
		}
	}
</script>

{#if $user == null}
	<h3>Sign Up</h3>

	<form on:submit|preventDefault="{onSubmit}">
		<Credentials bind:input />
		<button type="submit" disabled="{$commandStore.loading}"
			>SIGN UP</button>
	</form>

	<p>{message}</p>
{:else}
	<SignedIn />
{/if}
