import { define } from "~/utils/server/core.ts";
import {
	addClassroomMember,
	findClassroomByInvite,
	retrieveClassroom,
	retrieveClassroomMember,
} from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async GET(ctx) {
		const { code } = ctx.params;

		const classroomId = await findClassroomByInvite(code);

		if (!classroomId) {
			throw new HttpError(STATUS_CODE.NotFound, "Invalid Invite");
		} else {
			const user = ctx.state.user!;

			const classroom = await retrieveClassroom(classroomId, true);
			const member = await retrieveClassroomMember(classroom.id, user.id);

			const redirectToClassroom = ctx.redirect(
				`/classrooms/${classroom.id}/overview`,
			);

			if (member) {
				return redirectToClassroom;
			} else {
				await addClassroomMember(classroom.id, user.id);
				return redirectToClassroom;
			}
		}
	},
});
