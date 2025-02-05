import { HttpError, page, RouteConfig } from "fresh";
import { define } from "~/utils/core.ts";
import { EntryForm } from "~/islands/EntryForm.tsx";
import { STATUS_CODE } from "@std/http/status";
import { retrievePassword, searchUser } from "~/utils/user.ts";
import { verify } from "@felix/bcrypt";
import { createSession } from "~/utils/session.ts";

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
				const userId = await searchUser(username);

				if (userId) {
					const hashedPassword = await retrievePassword(userId);

					if (!hashedPassword) {
						return page();
					} else {
						const valid = await verify(password, hashedPassword);

						if (!valid) {
							return page();
						} else {
							return await createSession(userId);
						}
					}
				} else {
					return page();
				}
			}
		}
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <EntryForm mode="login" />;
});
