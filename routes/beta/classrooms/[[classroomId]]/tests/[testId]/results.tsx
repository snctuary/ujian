import { HttpError, page, RouteConfig } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { fetchTestResults } from "~/utils/server/tests.ts";
import { retrieveUser, User } from "~/utils/server/user.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;
		const test = ctx.state.currentTest!;

		if (member.userId !== test.authorId) {
			throw new HttpError(STATUS_CODE.Forbidden);
		} else {
			const partialResults = await fetchTestResults(classroomId, test.id);
			const users = new Map<string, User>();

			for (const { userId } of partialResults) {
				users.set(userId, await retrieveUser(userId, true));
			}

			const results = partialResults.map((result) => ({
				...result,
				user: users.get(result.userId)!,
			}));

			return page({ classroomId, test, results });
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classroomId, test, results } = data;

	return (
		<div class="flex flex-col h-full relative divide-y divide-gray-300">
			<div class="flex items-center gap-2 sticky top-0 p-4">
				<a href={`/beta/classrooms/${classroomId}/tests`}>
					<div class="hover:bg-slate-100 rounded-xl p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.75"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-chevron-left"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</div>
				</a>
				<p>{test.name}</p>
			</div>
			<div class="flex flex-col grow py-4 overflow-y-auto no-scrollbar px-4">
				{results.map((result) => (
					<div class="flex flex-col p-4 border border-gray-100 shadow-md rounded-2xl">
						<div class="flex justify-between items-center">
							<div class="flex items-center gap-4 grow">
								<div class="rounded-full size-12 bg-slate-100"></div>
								<div class="flex flex-col">
									<p class="font-semibold">{result.user.username}</p>
									<p class="font-medium text-slate-400 text-sm">
										Finished exam
									</p>
								</div>
							</div>
							<div class="flex flex-col justify-end text-slate-600 font-semibold text-right">
								<p>Correct</p>
								<p class="text-black font-bold">
									{result.results.filter((correct) => correct === true)
										.length}/<span class="text-xs text-slate-600 font-semibold">
										{test.totalQuestions} Questions
									</span>
								</p>
							</div>
						</div>
						<div class="w-full h-3 bg-slate-100 rounded-full mt-4 overflow-hidden">
							<div
								class="h-full rounded-full bg-purple-500"
								style={`width: ${result.score}%`}
							>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
