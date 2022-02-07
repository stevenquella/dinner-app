<script lang="ts">
	import { user } from "./lib/client";
	import SignIn from "./users/SignIn.svelte";
	import SignOut from "./users/SignOut.svelte";
	import SignUp from "./users/SignUp.svelte";
</script>

<main>
	<p>Hello, world.</p>
	<p>{$user?.email}</p>

	{#if $user == null}
		<SignIn />
		<hr />
		<SignUp />
	{:else}
		<SignOut />
	{/if}
</main>
