import { define } from "~/utils/server/core.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";
import { page } from "fresh";
import { ClassroomSettings } from "~/islands/beta/ClassroomSettings.tsx";

export const handler = define.handlers({
	GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;

		if (!hasFlags(member.flags, [ClassroomMemberFlags.HomeroomTeacher])) {
			return ctx.redirect(`/beta/classrooms/${classroomId}/tests`);
		} else {
			return page({
				classroom: ctx.state.classrooms.find((classroom) =>
					classroom.id === classroomId
				)!,
			});
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classroom } = data;

	return <ClassroomSettings classroom={classroom} />;
});
