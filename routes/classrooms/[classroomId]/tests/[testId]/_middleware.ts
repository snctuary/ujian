import { define } from "~/utils/server/core.ts";
import { retrieveClassroomTest } from "~/utils/server/classrooms.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { retrieveUser } from "~/utils/server/user.ts";

export const handler = define.middleware(async (ctx) => {
	const { testId } = ctx.params;
	const classroom = ctx.state.classroom!;

	const test = await retrieveClassroomTest(classroom.id, testId);

	if (!test) {
		throw new HttpError(STATUS_CODE.NotFound);
	} else {
		const author = await retrieveUser(test.authorId, true);
		ctx.state.classroomTest = { ...test, author };
		return await ctx.next();
	}
});
