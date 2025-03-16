import { define } from "~/utils/server/core.ts";
import { fetchTest } from "~/utils/server/tests.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.middleware(async (ctx) => {
	const { testId } = ctx.params;
	const classroomId = ctx.state.currentClassroomId!;

	const test = await fetchTest(classroomId, testId);

	if (!test) {
		throw new HttpError(STATUS_CODE.NotFound);
	} else {
		ctx.state.currentTest = test;
		return await ctx.next();
	}
});
