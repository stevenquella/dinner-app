module.exports = {
	daisyui: {
		themes: [
			{
				default: {
					primary: "#064e3b",
					secondary: "#3b82f6",
					accent: "#d6d3d1",
					neutral: "#374151",
					"base-100": "#111111",
					info: "#3ABFF8",
					success: "#36D399",
					warning: "#eab308",
					error: "#fb7185",
				},
			},
		],
	},
	plugins: [require("daisyui")],
	content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
	variants: {
		extend: {},
	},
};
