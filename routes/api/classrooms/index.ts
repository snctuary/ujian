import { define } from "~/utils/server/core.ts";
import { createClassroom } from "~/utils/server/classrooms.ts";

export interface CreateClassroomData {
	name: string;
	description?: string;
}

export const handler = define.handlers({
	async POST(ctx) {
		const homeroomTeacher = ctx.state.user!;
		const body: CreateClassroomData = await ctx.req.json();

		const classroom = await createClassroom(
			body.name,
			homeroomTeacher,
			body.description,
		);
		return Response.json(classroom);
	},
});
