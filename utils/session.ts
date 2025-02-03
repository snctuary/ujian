import { FreshContext } from "fresh";
import { getCookies } from "@std/http/cookie";
import { decode } from "@gz/jwt";
import { User } from "~/utils/user.ts";
import { env } from "~/utils/env.ts";
import { State } from "~/utils/core.ts";

export async function resolveSession(ctx: FreshContext<State>) {
	const cookies = getCookies(ctx.req.headers);
	const accessToken = cookies["access_token"];

	if (accessToken) {
		const user = await decode<User>(accessToken, env("JWT_SECRET", true), {
			algorithm: "HS256",
		});
		ctx.state.user = user;
	}
}
