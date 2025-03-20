import { getCookies } from "@std/http/cookie";
import { decode } from "@gz/jwt";
import { define } from "~/utils/server/core.ts";
import { createSession, Token } from "~/utils/server/session.ts";
import { retrieveUser } from "~/utils/server/user.ts";
import { env } from "~/utils/server/env.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const cookies = getCookies(ctx.req.headers);
		const refreshToken = cookies["refresh_token"];

		const backToLogin = ctx.redirect("/beta/login");

		if (refreshToken) {
			const token = await decode<Token>(refreshToken, env("JWT_SECRET", true));

			if (token.tokenType === "refresh_token") {
				const user = await retrieveUser(token.userId);

				if (user) {
					return await createSession(user.id);
				}
			}
		}

		return backToLogin;
	},
});
