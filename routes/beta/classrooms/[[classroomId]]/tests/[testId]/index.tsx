import { HttpError, page, RouteConfig } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { randomizeOrder } from "~/utils/server/tests.ts";
import { TestView } from "~/islands/beta/TestView.tsx";
import { hasFlags } from "~/utils/server/flags.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const test = ctx.state.currentTest!;
		const member = ctx.state.currentClassroomMember!;

		if (!hasFlags(member.flags, [ClassroomMemberFlags.Student])) {
			return ctx.redirect(`/beta/classrooms/${classroomId}/tests`);
		} else {
			if (Date.parse(test.endsAt) <= Date.now()) {
				return ctx.redirect(`/beta/classrooms/${classroomId}/tests`);
			} else {
				const randomized = await randomizeOrder(
					classroomId,
					test.id,
					member.userId,
				);

				if (!randomized) {
					throw new HttpError(
						STATUS_CODE.NotFound,
						"Can't find questions data for this test",
					);
				} else {
					return page({ classroomId, test, questions: randomized });
				}
			}
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classroomId, test, questions } = data;

	return <TestView data={{ ...test, classroomId, questions }} />;
});
