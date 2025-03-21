import { define } from "~/utils/server/core.ts";
import { resolveSession } from "~/utils/server/session.ts";

export const handler = define.middleware(async (ctx) => {
	await resolveSession(ctx);

	if (!ctx.state.user) {
		if (
			ctx.url.pathname === "/beta/login" ||
			ctx.url.pathname === "/beta/signup" ||
			ctx.url.pathname === "/auth/refresh_token" ||
			ctx.url.pathname.startsWith("/beta/partials")
		) {
			return await ctx.next();
		} else {
			return ctx.redirect("/auth/refresh_token");
		}
	} else {
		return await ctx.next();
	}
});
