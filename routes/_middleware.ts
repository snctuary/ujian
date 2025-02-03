import { define } from "~/utils/core.ts";
import { resolveSession } from "~/utils/session.ts";

export const handler = define.middleware(async (ctx) => {
	await resolveSession(ctx);
	return await ctx.next();
});
