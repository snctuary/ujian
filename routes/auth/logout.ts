import { deleteCookie } from "@std/http/cookie";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";

export const handler = define.handlers({
	GET(_ctx) {
		const headers = new Headers({ location: "/login" });

		deleteCookie(headers, "access_token", { path: "/" });
		deleteCookie(headers, "refresh_token", { path: "/auth/refresh_token" });

		return new Response(null, { headers, status: STATUS_CODE.Found });
	},
});
