import { define } from "~/utils/server/core.ts";
import { retrieveClassroomMember } from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.middleware(async (ctx) => {
	const { classroomId } = ctx.params;
	const user = ctx.state.user!;

	const member = await retrieveClassroomMember(classroomId, user.id);

	if (!member) {
		throw new HttpError(STATUS_CODE.NotFound, "Unknown Classroom");
	} else {
		ctx.state.currentClassroomId = classroomId;
		ctx.state.currentClassroomMember = member;
		return await ctx.next();
	}
});
