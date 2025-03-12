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
	const currentClassroomMember = await retrieveClassroomMember(
		classroomId,
		user.id,
	);

	ctx.state.classrooms = classrooms;
	ctx.state.currentClassroomId = ctx.params.classroomId;

	if (classroomId) {
		if (!currentClassroomMember) {
			return ctx.redirect("/beta/classrooms");
		} else {
			ctx.state.currentClassroomMember = currentClassroomMember;
		}
	}

	return await ctx.next();
});
