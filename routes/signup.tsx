import { HttpError, page, RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { EntryForm } from "~/islands/EntryForm.tsx";
import { STATUS_CODE } from "@std/http/status";
import { createUser } from "~/utils/server/user.ts";
import { createSession } from "~/utils/server/session.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/home");
		} else {
			return page();
		}
	},
	async POST(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/");
		} else {
			const formData = await ctx.req.formData();
			const username = formData.get("username");
			const password = formData.get("password");

			if (typeof username !== "string" || typeof password !== "string") {
				throw new HttpError(STATUS_CODE.BadRequest);
			} else {
				const newUser = await createUser({ username, password });
				const newSession = await createSession(newUser.id);

				return newSession;
			}
		}
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <EntryForm mode="signup" />;
});
