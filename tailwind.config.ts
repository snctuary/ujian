import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme.js";

export default {
	content: [
		"{routes,islands,components}/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				"sans": ["Visby", ...defaultTheme.fontFamily.sans],
			},
		},
	},
} satisfies Config;
