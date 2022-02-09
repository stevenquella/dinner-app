<script lang="ts">
	import { user } from "./lib/client";
	import { authRoutes, noAuthRoutes } from "./lib/routes";
	import Router from "svelte-spa-router";
	import SignOut from "./users/SignOut.svelte";
</script>

<main>
	{#if $user != null}
		<Router routes="{authRoutes}" />
	{:else}
		<Router routes="{noAuthRoutes}" />
	{/if}
</main>
