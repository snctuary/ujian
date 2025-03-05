import { Partial } from "fresh/runtime";
import { define } from "~/utils/server/core.ts";
import { fetchClassroomTest } from "~/utils/server/classrooms.ts";
import { page } from "fresh";

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const fetchedTest = await fetchClassroomTest(classroom.id);

		return page({ fetchedTest });
	},
});

export default define.page<typeof handler>((ctx) => {
	const classroom = ctx.state.classroom!;
	const { fetchedTest } = ctx.data;

	return (
		<Partial name="content">
			{fetchedTest.map((test) => (
				<a
					href={`/classrooms/${classroom.id}/tests/${test.id}/info`}
					f-client-nav={false}
				>
					<div class="flex flex-col p-3 gap-2 rounded-xl border border-gray-100 font-semibold">
						<p>{test.title}</p>
						<p>{test.endAt! <= Date.now() ? <p>Ended</p> : <p>Ongoing</p>}</p>
					</div>
				</a>
			))}
		</Partial>
	);
});
