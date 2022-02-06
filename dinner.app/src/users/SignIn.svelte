<script lang="ts">
	import { client } from "../lib/client";

	let username: string;
	let password: string;
	let error: string;

	async function onSubmit() {
		const response = await client.auth.signIn({
			email: username,
			password: password,
		});

		error = response.error?.message;
	}
</script>

<h3>Sign In</h3>

<form on:submit|preventDefault="{onSubmit}">
	<input
		name="username"
		type="email"
		placeholder="username"
		required
		bind:value="{username}"
	/>
	<input
		name="password"
		type="password"
		placeholder="password"
		required
		bind:value="{password}"
	/>
	<button type="submit">SIGN IN</button>
</form>

<p>{error}</p>
