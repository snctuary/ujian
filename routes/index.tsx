import { define } from "~/utils/server/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		return ctx.redirect(
			ctx.state.user ? "/beta/classrooms" : "/auth/refresh_token",
		);
	},
});
