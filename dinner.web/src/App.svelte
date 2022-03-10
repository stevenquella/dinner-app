<script lang="ts">
	import { user } from "$providers/_index";
	import { authRoutes, noAuthRoutes } from "$routes/_index";
	import Router from "svelte-spa-router";
</script>

{#if $user != null}
	<Router routes="{authRoutes}" />
{:else}
	<Router routes="{noAuthRoutes}" />
{/if}

<style global lang="postcss">
	@tailwind utilities;
	@tailwind components;
	@tailwind base;

	html,
	body,
	#app {
		@apply h-full overflow-auto;
	}
</style>
