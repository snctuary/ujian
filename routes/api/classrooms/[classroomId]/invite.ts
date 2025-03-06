import { define } from "~/utils/server/core.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import {
	ClassroomMemberFlags,
	createClassroomInvite,
	fetchClassroomInvite,
} from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const member = classroom.currentMember;

		if (!hasFlags(member.flags, [ClassroomMemberFlags.HomeroomTeacher])) {
			throw new HttpError(STATUS_CODE.Forbidden);
		} else {
			const inviteCode = await fetchClassroomInvite(classroom.id);

			if (!inviteCode) {
				throw new HttpError(STATUS_CODE.NotFound);
			} else {
				return Response.json({ inviteCode });
			}
		}
	},
	async POST(ctx) {
		const classroom = ctx.state.classroom!;
		const member = classroom.currentMember;

		if (!hasFlags(member.flags, [ClassroomMemberFlags.HomeroomTeacher])) {
			throw new HttpError(STATUS_CODE.Forbidden);
		} else {
			const inviteCode = await createClassroomInvite(classroom.id);
			return Response.json({ inviteCode });
		}
	},
});
