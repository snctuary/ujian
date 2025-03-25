import { define } from "~/utils/server/core.ts";
import { removeClassroomMember } from "~/utils/server/classrooms.ts";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async DELETE(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;

		await removeClassroomMember(classroomId, member);
		return new Response(null, { status: STATUS_CODE.NoContent });
	},
});
