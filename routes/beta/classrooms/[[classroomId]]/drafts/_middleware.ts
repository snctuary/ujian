import { define } from "~/utils/server/core.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";

export const handler = define.middleware(async (ctx) => {
	const currentMember = ctx.state.currentClassroomMember!;

	if (!hasFlags(currentMember.flags, [ClassroomMemberFlags.Teacher])) {
		return ctx.redirect(
			`/beta/classrooms/${ctx.state.currentClassroomId}/tests`,
		);
	} else {
		return await ctx.next();
	}
});
