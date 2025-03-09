import { page } from "fresh";
import { define } from "~/utils/server/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		return ctx.state.currentClassroomId
			? ctx.redirect(ctx.url.pathname + "/tests")
			: page();
	},
});

export default define.page((_ctx) => {
	return <p>Select a classroom first</p>;
});
