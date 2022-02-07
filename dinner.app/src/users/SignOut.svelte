<script lang="ts">
	import { signOut } from "./_users";

	const signout = signOut();

	async function onSignOut() {
		await signout.execute(null);
	}
</script>

<button type="input" disabled="{$signout.loading}" on:click="{onSignOut}">
	SIGN OUT
</button>
