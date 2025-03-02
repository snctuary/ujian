import { define } from "~/utils/server/core.ts";
import {
	createClassroomTest,
	CreateClassroomTestData,
} from "~/utils/server/classrooms.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const classroom = ctx.state.classroom!;

		const data: CreateClassroomTestData = await ctx.req.json();
		const newTest = await createClassroomTest(
			classroom.id,
			classroom.currentMember,
			data,
		);

		return Response.json(newTest);
	},
});
