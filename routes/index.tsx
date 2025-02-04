import { define } from "~/utils/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		return ctx.redirect(ctx.state.user ? "/home" : "/auth/refresh_token");
	},
});
