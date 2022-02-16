<script lang="ts">
	import type { ValidationError, AppError } from "../lib/errors";

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
