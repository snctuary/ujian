import { define } from "~/utils/server/core.ts";
import { createTestAnswer } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const { classroomId, testId } = ctx.params;
		const member = ctx.state.currentClassroomMember!;

		const data: number[] = await ctx.req.json();

		await createTestAnswer(classroomId, testId, member.userId, data);
		return Response.json(data);
	},
});
