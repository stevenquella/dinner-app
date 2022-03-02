import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import postcss from "./postcss.config.js";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), tsConfigPaths()],
	css: {
		postcss,
	},
});
