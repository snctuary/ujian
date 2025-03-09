import { define } from "~/utils/server/core.ts";
import { retrieveClassroomMembers } from "~/utils/server/classrooms.ts";
import { page } from "fresh";

export const handler = define.handlers({
	async GET(ctx) {
		const members = await retrieveClassroomMembers(
			ctx.state.currentClassroomId!,
			true,
		);
		return page({ members });
	},
});

export default define.page<typeof handler>((_ctx) => {
	return (
		<div class="flex flex-col grow relative gap-2">
			<div class="flex justify-between gap-2">
				<form class="flex items-center rounded-xl border border-gray-300 shadow-md relative overflow-hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.75"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute left-3 stroke-gray-400 lucide lucide-search"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						class="outline-none pl-10 pr-3 py-2"
						name="query"
						type="text"
					/>
				</form>
			</div>
		</div>
	);
});
