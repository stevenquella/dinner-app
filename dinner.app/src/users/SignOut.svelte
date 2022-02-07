<script lang="ts">
	import { client } from "../lib/client";

	async function onSignOut() {
		await client.auth.signOut();
	}
</script>

<button type="input" on:click="{onSignOut}">SIGN OUT</button>
