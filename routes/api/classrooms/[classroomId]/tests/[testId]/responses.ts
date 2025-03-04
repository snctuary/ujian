import { define } from "~/utils/server/core.ts";
import {
	ClassroomTestResponses,
	createClassroomTestResponse,
} from "~/utils/server/classrooms.ts";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async POST(ctx) {
		const classroom = ctx.state.classroom!;
		const test = ctx.state.classroomTest!;

		const body: ClassroomTestResponses = await ctx.req.json();

		await createClassroomTestResponse(
			classroom.id,
			test.id,
			classroom.currentMember.userId,
			body,
		);

		return new Response(null, { status: STATUS_CODE.NoContent });
	},
});
