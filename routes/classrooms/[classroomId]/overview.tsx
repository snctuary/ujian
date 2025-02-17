import { Partial } from "fresh/runtime";
import { define } from "~/utils/server/core.ts";

export default define.page((ctx) => {
	const classroom = ctx.state.classroom!;

	return (
		<Partial name="content">
			<div class="flex flex-col overflow-y-scroll gap-2 no-scrollbar">
				<p class="font-bold text-2xl">Description</p>
				<p>
					{classroom.description ?? "No description set for this classroom."}
				</p>
			</div>
		</Partial>
	);
});
