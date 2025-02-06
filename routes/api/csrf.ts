import { define } from "~/utils/server/core.ts";
import { createToken } from "~/utils/server/session.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const user = ctx.state.user!;

		const csrfToken = await createToken(user.id, "csrf");
		return Response.json(csrfToken);
	},
});
