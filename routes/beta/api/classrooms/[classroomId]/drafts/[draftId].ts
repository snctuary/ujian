import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { editDraft, fetchDraft, TestDraft } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async PATCH(ctx) {
		const { classroomId, draftId } = ctx.params;
		const member = ctx.state.currentClassroomMember!;

		const draft = await fetchDraft(classroomId, member.userId, draftId);

		if (!draft) {
			throw new HttpError(STATUS_CODE.NotFound, "Unknown Draft");
		} else {
			const data: Partial<Omit<TestDraft, "id">> = await ctx.req.json();
			const updated = await editDraft(
				classroomId,
				member.userId,
				draftId,
				data,
			);

			return Response.json(updated);
		}
	},
});
