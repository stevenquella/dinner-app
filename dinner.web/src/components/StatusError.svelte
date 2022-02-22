<script lang="ts">
	import type { ValidationError } from "$utilities/_index";
	import type { AppError } from "$utilities/_types";

	export let error: AppError;

	function isValidationError(error: AppError): error is ValidationError {
		return error && "errors" in error;
	}
</script>

{#if isValidationError(error)}
	{#each error.errors as e}
		<p>{e}</p>
	{/each}
{:else}
	<p>{error?.message || ""}</p>
{/if}
