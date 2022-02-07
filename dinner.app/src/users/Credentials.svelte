<script lang="ts">
	export let username: string;
	export let password: string;
</script>

<input
	name="username"
	type="email"
	placeholder="username"
	required
	bind:value="{username}" />
<input
	name="password"
	type="password"
	placeholder="password"
	required
	bind:value="{password}" />
