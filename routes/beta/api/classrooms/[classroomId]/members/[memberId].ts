import { define } from "~/utils/server/core.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import {
	ClassroomMemberFlags,
	editClassroomMember,
	EditMemberData,
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
			const { memberId } = ctx.params;
			const data: Partial<EditMemberData> = await ctx.req.json();

			if (
				data.flags &&
				(data.flags !== ClassroomMemberFlags.Teacher &&
					data.flags !== ClassroomMemberFlags.Student)
			) {
				throw new HttpError(
					STATUS_CODE.BadRequest,
					"Only STUDENT and TEACHER allowed as flags value",
				);
			} else {
				const updated = await editClassroomMember(classroomId, memberId, data);
				return Response.json(updated);
			}
		}
	},
});
