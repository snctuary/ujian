import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { decode } from "@gz/jwt";
import { Token } from "~/utils/server/session.ts";
import { env } from "~/utils/server/env.ts";

export const handler = define.middleware(async (ctx) => {
	if (ctx.url.pathname !== "/api/csrf") {
		const csrf = ctx.req.headers.get("x-csrf-token");
		const unauthorized = new HttpError(STATUS_CODE.Unauthorized);

		if (!csrf) {
			throw unauthorized;
		} else {
			const token = await decode<Token>(csrf, env("JWT_SECRET", true));

			if (token.tokenType === "csrf") {
				if (ctx.state.user?.id !== token.userId) {
					throw unauthorized;
				}
			} else {
				throw unauthorized;
			}
		}
	}

	return await ctx.next();
});
