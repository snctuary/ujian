import { HttpError, page, RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import { STATUS_CODE } from "@std/http/status";
import { Cancel } from "~/islands/Cancel.tsx";
import { CreateClassroomTest } from "~/islands/CreateClassroomTest.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(ctx) {
		const classroom = ctx.state.classroom!;

		if (
			!hasFlags(classroom.currentMember.flags, [
				ClassroomMemberFlags.Teacher,
			]) &&
			!hasFlags(classroom.currentMember.flags, [
				ClassroomMemberFlags.HomeroomTeacher,
			])
		) {
			throw new HttpError(STATUS_CODE.Forbidden);
		} else {
			return page();
		}
	},
});

export default define.page<typeof handler>((ctx) => {
	const classroom = ctx.state.classroom!;

	return (
		<div class="flex flex-col py-4 gap-3 select-none relative overflow-y-auto no-scrollbar">
			<div class="flex items-center gap-2 px-4 backdrop-blur-md sticky top-0">
				<Cancel redirectTo={`/classrooms/${classroom.id}/tests`} />
				<p class="font-semibold text-lg">Create New Test</p>
			</div>
			<CreateClassroomTest classroomId={classroom.id} />
		</div>
	);
});
