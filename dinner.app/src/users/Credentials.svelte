<script lang="ts">
	export let input: { email: string; password: string };
</script>

<input
	name="email"
	type="email"
	placeholder="email"
	required
	bind:value="{input.email}" />
<input
	name="password"
	type="password"
	placeholder="password"
	required
	bind:value="{input.password}" />
