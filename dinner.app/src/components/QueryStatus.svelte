<script lang="ts">
	import type { QueryStore } from "../lib/types";
	export let query: QueryStore<any>;
</script>

{#if $query.loading}
	<p>Loading...</p>
{/if}

{#if $query.error}
	<p>{$query.error}</p>
{/if}
