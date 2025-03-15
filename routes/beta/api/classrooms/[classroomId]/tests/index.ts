import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { createTest } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const data = await ctx.req.formData();

		const name = data.get("name");
		const duration = Number(data.get("duration"));
		const templateId = data.get("templateId");

		if (
			typeof name !== "string" || isNaN(duration) ||
			typeof templateId !== "string"
		) {
			throw new HttpError(STATUS_CODE.BadRequest);
		} else {
			const newTest = await createTest(
				classroomId,
				ctx.state.currentClassroomMember!.userId,
				{ name, duration, templateId },
			);

			return ctx.redirect(
				`/beta/classrooms/${classroomId}/tests/${newTest.id}`,
			);
		}
	},
});
