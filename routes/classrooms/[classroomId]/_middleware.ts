import { define } from "~/utils/server/core.ts";
import {
	retrieveClassroom,
	retrieveClassroomMember,
} from "~/utils/server/classrooms.ts";
import { retrieveUser } from "~/utils/server/user.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.middleware(async (ctx) => {
	const { classroomId } = ctx.params;
	const user = ctx.state.user!;

	const currentMember = await retrieveClassroomMember(classroomId, user.id);

	if (currentMember) {
		const classroom = await retrieveClassroom(classroomId);

		if (classroom) {
			const homeroomTeacher = await retrieveUser(
				classroom.homeroomTeacherId,
				true,
			);
			ctx.state.classroom = { ...classroom, currentMember, homeroomTeacher };

			return await ctx.next();
		}
	}

	throw new HttpError(STATUS_CODE.NotFound);
});
