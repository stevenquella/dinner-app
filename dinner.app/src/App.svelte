<script lang="ts">
	import { user } from "./lib/client";
	import SignIn from "./users/SignIn.svelte";
</script>

<main>
	<p>Hello, world.</p>
	<p>{$user?.email}</p>

	{#if $user == null}
		<SignIn />
	{/if}
</main>
