import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import {
	addClassroomMember,
	findClassroomByInvite,
	retrieveJoinedClassrooms,
} from "~/utils/server/classrooms.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const { code } = ctx.params;
		const user = ctx.state.user;

		if (!user) {
			throw new HttpError(STATUS_CODE.Unauthorized);
		} else {
			const classroomId = await findClassroomByInvite(code);

			if (!classroomId) {
				throw new HttpError(STATUS_CODE.BadRequest, "Invalid invite");
			} else {
				const joinedClassrooms = await retrieveJoinedClassrooms(user.id);

				if (!joinedClassrooms.includes(classroomId)) {
					await addClassroomMember(classroomId, user);
				}

				return Response.json({ classroomId });
			}
		}
	},
});
