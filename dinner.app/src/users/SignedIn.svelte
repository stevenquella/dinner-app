<script>
	import { replace } from "svelte-spa-router";

	// automatically route to home when displayed
	replace("/");
</script>

<p>Signed in successfully.</p>
<a href="#/">GO HOME</a>
