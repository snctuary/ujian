import { define } from "~/utils/server/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		return ctx.redirect("/beta/classrooms");
	},
});
