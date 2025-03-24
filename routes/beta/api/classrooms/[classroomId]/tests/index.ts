import { define } from "~/utils/server/core.ts";
import { createTest, CreateTestOptions } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const data: CreateTestOptions = await ctx.req.json();

		const newTest = await createTest(
			classroomId,
			ctx.state.currentClassroomMember!.userId,
			data,
		);

		return Response.json(newTest);
	},
});
