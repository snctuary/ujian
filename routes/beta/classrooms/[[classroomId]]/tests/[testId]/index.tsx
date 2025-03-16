import { page, RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const test = ctx.state.currentTest!;

		if (Date.parse(test.endsAt) <= Date.now()) {
			return ctx.redirect(`/beta/classrooms/${classroomId}/tests`);
		} else {
			return page({ test });
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { test } = data;

	return <p>{test.name}</p>;
});
