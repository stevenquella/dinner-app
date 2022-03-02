<script lang="ts">
	import { user } from "$providers/_index";
	import { authRoutes, noAuthRoutes } from "$routes/_index";
	import Router from "svelte-spa-router";
</script>

<main>
	{#if $user != null}
		<Router routes="{authRoutes}" />
	{:else}
		<Router routes="{noAuthRoutes}" />
	{/if}
</main>

<style global lang="postcss">
	@tailwind utilities;
	@tailwind components;
	@tailwind base;
</style>
