import { define } from "~/utils/server/core.ts";
import { retrieveJoinedClassrooms } from "~/utils/server/classrooms.ts";

export const handler = define.middleware(async (ctx) => {
	const { classroomId } = ctx.params;
	const classrooms = await retrieveJoinedClassrooms(
		ctx.state.user!.id,
		true,
	);
	ctx.state.classrooms = classrooms;
	ctx.state.currentClassroomId = ctx.params.classroomId;

	if (
		classroomId && !classrooms.find((classroom) => classroom.id === classroomId)
	) {
		return ctx.redirect("/beta/classrooms");
	}

	return await ctx.next();
});
