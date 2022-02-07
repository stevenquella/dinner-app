<script lang="ts">
	import { client } from "../lib/client";

	let username: string;
	let password: string;
	let message: string;

	async function onSubmit() {
		const response = await client.auth.signUp({
			email: username,
			password: password,
		});

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

<h3>Sign Up</h3>

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
	<button type="submit">SIGN UP</button>
</form>

<p>{message}</p>
