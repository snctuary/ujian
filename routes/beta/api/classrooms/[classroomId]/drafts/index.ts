import { define } from "~/utils/server/core.ts";
import { createDraft } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;

		const newDraft = await createDraft(
			classroomId,
			member.userId,
			"New Test",
			[],
		);
		return Response.json(newDraft);
	},
});
