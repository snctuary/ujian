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
			<div class="flex mb-4" f-client-nav={false}>
				<a
					class="flex grow gap-2 items-center bg-black text-white font-semibold fill-current px-4 py-2 rounded-lg"
					href={ctx.url.pathname + "/new"}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
						id="Capa_1"
						x="0px"
						y="0px"
						viewBox="0 0 512 512"
						style="enable-background:new 0 0 512 512;"
						xml:space="preserve"
						width="18"
						height="18"
					>
						<g>
							<path d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
						</g>
					</svg>
					<p>Create Test</p>
				</a>
			</div>
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
