<script lang="ts">
	import SignedIn from "./SignedIn.svelte";

	import { user } from "../lib/client";
	import Credentials from "./Credentials.svelte";
	import { signIn } from "./_users";

	let username: string = "";
	let password: string = "";
	let error: string;

	const signin = signIn();

	async function onSubmit(): Promise<void> {
		const response = await signin.execute({
			email: username,
			password: password,
		});

		error = response.error?.message;
	}
</script>

{#if $user == null}
	<h3>Sign In</h3>

	<form on:submit|preventDefault="{onSubmit}">
		<Credentials bind:username bind:password />
		<button type="submit" disabled="{$signin.loading}">SIGN IN</button>
	</form>

	<p>{error}</p>
{:else}
	<SignedIn />
{/if}
