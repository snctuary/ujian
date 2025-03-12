import { define } from "~/utils/server/core.ts";
import {
	retrieveClassroomMember,
	retrieveJoinedClassrooms,
} from "~/utils/server/classrooms.ts";

export const handler = define.middleware(async (ctx) => {
	const { classroomId } = ctx.params;
	const user = ctx.state.user!;
	const classrooms = await retrieveJoinedClassrooms(
		user.id,
		true,
	);
	ctx.state.classrooms = classrooms;
	ctx.state.currentClassroomId = ctx.params.classroomId;

	if (
		classroomId && !classrooms.find((classroom) => classroom.id === classroomId)
	) {
		return ctx.redirect("/beta/classrooms");
	}

	const currentClassroomMember = await retrieveClassroomMember(
		classroomId,
		user.id,
		true,
	);
	ctx.state.currentClassroomMember = currentClassroomMember;

	return await ctx.next();
});
