import { define } from "~/utils/server/core.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import {
	Classroom,
	ClassroomMemberFlags,
	deleteClassroom,
	editClassroom,
} from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async PATCH(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;

		if (!hasFlags(member.flags, [ClassroomMemberFlags.HomeroomTeacher])) {
			throw new HttpError(STATUS_CODE.Forbidden);
		} else {
			const payload: Partial<Classroom> = await ctx.req.json();
			const updatedClassroom = await editClassroom(classroomId, payload);

			return Response.json(updatedClassroom);
		}
	},
	async DELETE(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;

		if (!hasFlags(member.flags, [ClassroomMemberFlags.HomeroomTeacher])) {
			throw new HttpError(STATUS_CODE.Forbidden);
		} else {
			await deleteClassroom(classroomId);
			return new Response(null, { status: STATUS_CODE.NoContent });
		}
	},
});
