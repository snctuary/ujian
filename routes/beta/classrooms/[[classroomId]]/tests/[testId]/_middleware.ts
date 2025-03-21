import { define } from "~/utils/server/core.ts";
import { deleteTest, fetchTest } from "~/utils/server/tests.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.middleware(async (ctx) => {
	const { testId } = ctx.params;
	const classroomId = ctx.state.currentClassroomId!;

	const test = await fetchTest(classroomId, testId);

	if (!test) {
		throw new HttpError(STATUS_CODE.NotFound);
	} else {
		if (!test.totalQuestions) {
			await deleteTest(classroomId, testId);
			return await ctx.redirect(`/beta/classrooms/${classroomId}/tests`);
		} else {
			ctx.state.currentTest = test;
			return await ctx.next();
		}
	}
});
