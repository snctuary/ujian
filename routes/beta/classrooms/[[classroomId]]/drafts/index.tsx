import { page } from "fresh";
import { define } from "~/utils/server/core.ts";
import { fetchDrafts } from "~/utils/server/tests.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const { data } = await fetchDrafts(
			ctx.state.currentClassroomId!,
			ctx.state.currentClassroomMember!.userId,
		);
		return page({ drafts: data });
	},
});

export default define.page<typeof handler>((ctx) => {
	const classroomId = ctx.state.currentClassroomId!;

	return (
		<div class="flex flex-col grow relative gap-2 border border-gray-300 rounded-xl divide-y divide-gray-300">
			<div class="flex justify-between gap-2 p-3">
				<form
					class="flex items-center rounded-xl border border-gray-300 shadow-md relative overflow-hidden"
					method="GET"
					f-partial={`/beta/partials/classrooms/${classroomId}/drafts`}
				>
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
						class="outline-none pl-10 pr-3 h-10 placeholder:text-gray-400"
						name="q"
						placeholder="Search drafts"
						type="text"
					/>
				</form>
			</div>
			<div class="flex flex-col gap-2 p-2">
				<p>Drafts will be shown here</p>
			</div>
		</div>
	);
});
