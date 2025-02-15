import { FreshContext } from "fresh";
import { getCookies } from "@std/http/cookie";
import { decode, encode, JWTPayload } from "@gz/jwt";
import { retrieveUser } from "~/utils/server/user.ts";
import { env } from "~/utils/server/env.ts";
import { State } from "~/utils/server/core.ts";
import { setCookie } from "@std/http/cookie";
import { STATUS_CODE } from "@std/http/status";

const TokenExpire = {
	AccessToken: 24 * 60 * 60,
	Csrf: 5 * 60,
	RefreshToken: 7 * 24 * 60 * 60,
};

export async function createSession(userId: string) {
	const accessToken = await createToken(userId, "access_token");
	const refreshToken = await createToken(userId, "refresh_token");

	const headers = new Headers({ location: "/home" });

	setCookie(headers, {
		name: "access_token",
		value: accessToken.data,
		expires: accessToken.expireIn * 1000,
		httpOnly: true,
		path: "/",
	});
	setCookie(headers, {
		name: "refresh_token",
		value: refreshToken.data,
		expires: refreshToken.expireIn * 1000,
		httpOnly: true,
		path: "/auth/refresh_token",
	});

	return new Response(null, { headers, status: STATUS_CODE.Found });
}
export async function createToken(userId: string, tokenType: TokenType) {
	let expireIn = Math.floor(Date.now() / 1000);

	switch (tokenType) {
		case "access_token": {
			expireIn += TokenExpire.AccessToken;
			break;
		}
		case "csrf": {
			expireIn += TokenExpire.Csrf;
			break;
		}
		case "refresh_token": {
			expireIn += TokenExpire.RefreshToken;
			break;
		}
	}

	const payload: Token = {
		exp: expireIn,
		tokenType,
		userId,
	};

	const token = await encode(payload, env("JWT_SECRET", true));
	return { data: token, expireIn };
}

export async function resolveSession(ctx: FreshContext<State>) {
	const cookies = getCookies(ctx.req.headers);
	const accessToken = cookies["access_token"];

	if (accessToken) {
		const token = await decode<Token>(accessToken, env("JWT_SECRET", true));

		if (token.tokenType === "access_token") {
			const user = await retrieveUser(token.userId);
			ctx.state.user = user;
		}
	}
}

export interface Token extends JWTPayload {
	tokenType: TokenType;
	userId: string;
}
type TokenType = "access_token" | "csrf" | "refresh_token";
