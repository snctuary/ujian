import { define } from "~/utils/server/core.ts";
import { createDraft } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const newDraft = await createDraft(
			classroomId,
			ctx.state.currentClassroomMember!.userId,
			"New Test",
			[],
		);

		return await ctx.redirect(
			`/beta/classrooms/${classroomId}/drafts/${newDraft.id}`,
		);
	},
});
