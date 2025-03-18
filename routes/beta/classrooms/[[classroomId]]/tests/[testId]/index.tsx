import { HttpError, page, RouteConfig } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { fetchTestQuestions } from "~/utils/server/tests.ts";
import { TestView } from "~/islands/beta/TestView.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const test = ctx.state.currentTest!;

		if (Date.parse(test.endsAt) <= Date.now()) {
			return ctx.redirect(`/beta/classrooms/${classroomId}/tests`);
		} else {
			const questions = await fetchTestQuestions(classroomId, test.id);

			if (!questions) {
				throw new HttpError(
					STATUS_CODE.NotFound,
					"Can't find questions data for this test",
				);
			} else {
				return page({ test, questions });
			}
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { test, questions } = data;

	return <TestView data={{ ...test, questions }} />;
});
