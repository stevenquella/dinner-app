<script lang="ts">
	import Credentials from "./Credentials.svelte";
	import { signIn } from "./_users";

	let username: string;
	let password: string;
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

<h3>Sign In</h3>

<form on:submit|preventDefault="{onSubmit}">
	<Credentials bind:username bind:password />
	<button type="submit" disabled="{$signin.loading}">SIGN IN</button>
</form>

<p>{error}</p>
