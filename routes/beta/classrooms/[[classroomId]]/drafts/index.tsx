import { page } from "fresh";
import { define } from "~/utils/server/core.ts";
import { fetchDrafts } from "~/utils/server/tests.ts";
import { timeAgo } from "@egamagz/time-ago";

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
	const { drafts } = ctx.data;

	return (
		<div class="flex flex-col size-full relative gap-2 border border-gray-300 rounded-xl divide-y divide-gray-300">
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
			<div class="flex flex-col gap-2 p-2 overflow-y-auto no-scrollbar">
				{drafts.map((draft) => (
					<div class="flex justify-between items-center p-3 border border-gray-300 rounded-xl shadow-md">
						<div class="flex flex-col gap-1 grow">
							<p>{draft.name}</p>
							<div class="flex items-center gap-2 font-medium text-xs">
								<p>
									{draft.questions.length} Questions
								</p>
								<div class="size-2 rounded-full bg-slate-100"></div>
								<p>Last edited {timeAgo(new Date(draft.lastEditedAt))}</p>
							</div>
						</div>
						<div>
							<button
								class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-semibold"
								type="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-pencil-line"
								>
									<path d="M12 20h9" />
									<path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
									<path d="m15 5 3 3" />
								</svg>
								<p>Edit</p>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
