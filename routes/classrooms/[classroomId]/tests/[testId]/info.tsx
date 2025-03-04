import { page, RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { Cancel } from "~/islands/Cancel.tsx";
import { isAlreadySubmitTestResponses } from "~/utils/server/classrooms.ts";
import { BeginTest } from "~/islands/BeginTest.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const test = ctx.state.classroomTest!;

		const alreadySubmit = await isAlreadySubmitTestResponses(
			classroom.id,
			test.id,
			classroom.currentMember.userId,
		);
		return page({ alreadySubmit });
	},
});

export default define.page<typeof handler>((ctx) => {
	const classroom = ctx.state.classroom!;
	const test = ctx.state.classroomTest!;

	const { alreadySubmit } = ctx.data;

	return (
		<div class="flex flex-col h-dvh p-4 relative">
			<div class="flex items-center gap-2 sticky top-0">
				<Cancel redirectTo={`/classrooms/${classroom.id}/tests`} />
				<p class="font-semibold">{test.title}</p>
			</div>
			<div class="grow overflow-y-scroll no-scrollbar">
				<p class="font-semibold text-3xl">{test.title}</p>
				<div class="flex gap-1 font-semibold text-sm">
					<p>
						by{" "}
						<span>
							<div class="size-6 bg-slate-100 rounded-full"></div>
						</span>{" "}
						{test.author.username}
					</p>
				</div>
				<p class="mt-4 font-semibold text-sm">About</p>
				<p class="text-slate-400 text-sm">
					{test.description ?? "No description set for this test."}
				</p>
				<p class="mt-4 font-semibold text-sm">Details</p>
				<div class="flex flex-col bg-slate-100 rounded-3xl text-sm font-semibold p-3 mt-1">
					<div class="flex justify-between">
						<p>Total Questions</p>
						<p class="text-slate-500">{test.quiz.length} Questions</p>
					</div>
				</div>
			</div>
			<div class="flex w-full">
				<BeginTest
					classroomId={classroom.id}
					testId={test.id}
					disabled={alreadySubmit}
				/>
			</div>
		</div>
	);
});
