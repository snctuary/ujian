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
	return (
		<div class="flex justify-center items-center grow">
			<p class="font-semibold text-gray-400 text-2xl">Select a classroom</p>
		</div>
	);
});
