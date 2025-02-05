import { define } from "~/utils/core.ts";
import { resolveSession } from "~/utils/session.ts";

export const handler = define.middleware(async (ctx) => {
	await resolveSession(ctx);

	if (!ctx.state.user) {
		if (
			ctx.url.pathname === "/login" || ctx.url.pathname === "/signup" ||
			ctx.url.pathname === "/auth/refresh_token"
		) {
			return await ctx.next();
		} else {
			return ctx.redirect("/auth/refresh_token");
		}
	} else {
		return await ctx.next();
	}
});
