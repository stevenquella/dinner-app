<script lang="ts">
	import dayjs from "dayjs";

	export let date: Date;
	export let format: string = "YYYY-MM-DD";
	let value: string;

	const input = (x: Date) => (value = dayjs(x).format(format));
	const output = (x: string) => (date = dayjs(x, format).toDate());

	$: input(date);
	$: output(value);
</script>

<input type="date" bind:value />
