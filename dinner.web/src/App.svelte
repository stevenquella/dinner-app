<script lang="ts">
	import { IconCollection, IconUser } from "$components/_Index.svelte";
	import { user } from "$providers/_index";
	import { authRoutes, noAuthRoutes } from "$routes/_index";
	import Router from "svelte-spa-router";
	import active from "svelte-spa-router/active";
</script>

{#if $user != null}
	<!-- TODO pull into navbar component-->
	<div class="navbar">
		<div class="flex-1">
			<a class="btn btn-ghost" href="#/"><h1>What's Supper?</h1></a>
		</div>
		<div class="flex gap-2">
			<a class="btn btn-square btn-ghost" href="#/meals" use:active>
				<IconCollection />
			</a>
			<a class="btn btn-square btn-ghost" href="#/user" use:active>
				<IconUser />
			</a>
		</div>
	</div>

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

	h1 {
		@apply text-xl font-bold;
	}

	.active {
		@apply bg-primary;
	}
</style>
