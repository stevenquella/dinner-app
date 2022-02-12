<script lang="ts">
	import { user } from "../lib/client";
	import { signUp } from "./_users";
	import Credentials from "./Credentials.svelte";
	import SignedIn from "./SignedIn.svelte";

	let username: string = "";
	let password: string = "";
	let message: string;

	const signup = signUp();

	async function onSubmit() {
		const response = await signup.execute({
			email: username,
			password: password,
		});

		// will return the user, but does not change the auth state, requires email confirmation
		if (response.error) {
			message = response.error.message;
		} else if (response.result?.user) {
			message = `Sign up submitted successfully. Please confirm at ${response.result.user.email}.`;
		} else {
			console.debug(response);
			message = "Unknown result. Please try again.";
		}
	}
</script>

{#if $user == null}
	<h3>Sign Up</h3>

	<form on:submit|preventDefault="{onSubmit}">
		<Credentials bind:username bind:password />
		<button type="submit" disabled="{$signup.loading}">SIGN UP</button>
	</form>

	<p>{message}</p>
{:else}
	<SignedIn />
{/if}
