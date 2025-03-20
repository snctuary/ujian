import { page } from "fresh";
import { define } from "~/utils/server/core.ts";
import {
	fetchStatus,
	fetchTests,
	TestStatusCode,
} from "~/utils/server/tests.ts";
import { TestStatus } from "~/components/beta/TestStatus.tsx";

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const member = ctx.state.currentClassroomMember!;

		const fetchedTests = await fetchTests(classroomId);
		const status = new Map<string, TestStatusCode>();

		for (const test of fetchedTests) {
			status.set(test.id, await fetchStatus(classroomId, test, member.userId));
		}

		return page({
			classroomId,
			tests: fetchedTests.map((test) => ({
				...test,
				status: status.get(test.id)!,
				statusText:
					TestStatusCode[status.get(test.id)!] as keyof typeof TestStatusCode,
			})),
		});
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classroomId, tests } = data;

	return (
		<div class="flex flex-col size-full relative gap-2 border border-gray-300 rounded-xl divide-y divide-gray-300">
			<div class="flex justify-between gap-2 p-3">
				<form
					class="flex items-center rounded-xl border border-gray-300 shadow-md relative overflow-hidden"
					method="GET"
					f-partial={`/beta/partials/classrooms/${classroomId}/tests`}
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
						placeholder="Find a test"
						type="text"
					/>
				</form>
			</div>
			<div class="flex flex-col gap-2 p-2 overflow-y-auto no-scrollbar relative">
				{tests.map((test) => (
					<div
						data-status={test.status}
						class="flex flex-col p-3 rounded-xl border border-gray-200 shadow-md data-[status=2]:opacity-50 data-[status=3]:opacity-50 data-[status=2]:bg-slate-100"
					>
						<div class="flex flex-col">
							<p class="text-lg font-medium">{test.name}</p>
							<div class="flex">
								<div class="flex items-center gap-2 p-2 rounded-full bg-slate-100 text-slate-500">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-circle-dashed"
									>
										<path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
										<path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
										<path d="M17.609 3.721a10 10 0 0 1 2.69 2.7" />
										<path d="M2.182 13.9a10 10 0 0 1 0-3.8" />
										<path d="M20.279 17.609a10 10 0 0 1-2.7 2.69" />
										<path d="M21.818 10.1a10 10 0 0 1 0 3.8" />
										<path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" />
										<path d="M6.391 20.279a10 10 0 0 1-2.69-2.7" />
									</svg>
									<p class="text-xs">{test.totalQuestions} Questions</p>
								</div>
							</div>
						</div>
						<div class="flex items-center justify-between mt-2">
							<TestStatus status={test.status} statusText={test.statusText} />
							<a
								href={`/beta/classrooms/${classroomId}/tests/${test.id}`}
								f-client-nav={false}
							>
								<div
									data-status={test.status}
									class="hidden data-[status=1]:flex px-3 py-2 bg-black rounded-lg"
								>
									<p class="text-white text-sm font-mediumm">Start Exam</p>
								</div>
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
