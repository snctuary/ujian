import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { updateUser, UpdateUserData } from "~/utils/server/user.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const user = ctx.state.user!;

		const form = await ctx.req.formData();
		const rawPayload = form.get("payload_json");
		const avatar = form.get("avatar");

		const badRequest = new HttpError(STATUS_CODE.BadRequest);

		if (
			typeof rawPayload !== "string" || (avatar && !(avatar instanceof File))
		) {
			throw badRequest;
		} else {
			const payload: UpdateUserData = { ...JSON.parse(rawPayload), avatar };
			const updatedUser = await updateUser(user, payload);

			return Response.json(updatedUser);
		}
	},
});
