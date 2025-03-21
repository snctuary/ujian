import { define } from "~/utils/server/core.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.middleware(async (ctx) => {
	const currentMember = ctx.state.currentClassroomMember!;

	if (!hasFlags(currentMember.flags, [ClassroomMemberFlags.Teacher])) {
		throw new HttpError(STATUS_CODE.Forbidden);
	} else {
		return await ctx.next();
	}
});
