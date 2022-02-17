<script lang="ts">
	export let input: { email: string; password: string };
</script>

<input
	name="email"
	type="email"
	placeholder="email"
	bind:value="{input.email}" />
<input
	name="password"
	type="password"
	placeholder="password"
	bind:value="{input.password}" />
