import { define } from "~/utils/server/core.ts";
import { retrieveJoinedClassrooms } from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.middleware(async (ctx) => {
	const { classroomId } = ctx.params;
	const user = ctx.state.user!;
	const classrooms = await retrieveJoinedClassrooms(user.id);

	if (classrooms.includes(classroomId)) {
		ctx.state.currentClassroomId = classroomId;
		return await ctx.next();
	} else {
		throw new HttpError(STATUS_CODE.NotFound);
	}
});
