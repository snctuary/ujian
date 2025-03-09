import { define } from "~/utils/server/core.ts";
import { retrieveClassroomMembers } from "~/utils/server/classrooms.ts";
import { page } from "fresh";
import { memberRole } from "~/utils/client/memberRole.ts";
import { Partial } from "fresh/runtime";

export const handler = define.handlers({
	async GET(ctx) {
		const members = await retrieveClassroomMembers(
			ctx.state.currentClassroomId!,
			true,
		);

		return page({ members });
	},
});

export default define.page<typeof handler>((ctx) => {
	const { members } = ctx.data;

	return (
		<div class="flex flex-col grow relative gap-2 border border-gray-300 rounded-xl divide-y divide-gray-300">
			<div class="flex justify-between gap-2 p-3">
				<form
					class="flex items-center rounded-xl border border-gray-300 shadow-md relative overflow-hidden"
					method="GET"
					f-partial={`/beta/partials/classrooms/${ctx.state
						.currentClassroomId!}/members`}
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
						placeholder="Search a member"
						type="text"
					/>
				</form>
			</div>
			<Partial name="members">
				<table class="table-auto text-center">
					<thead class="bg-gray-100 text-slate-500 border-y border-collapse border-gray-300 h-12">
						<tr>
							<th>Name</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{members.map((member) => (
							<tr class="hover:bg-gray-50">
								<td class="border-b border-gray-300 h-14">
									<div class="flex justify-center items-center gap-2">
										<div class="size-8 bg-gray-100 rounded-full"></div>
										{member.user.username}
									</div>
								</td>
								<td class="border-b border-gray-300 h-14">
									{memberRole(member.flags)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Partial>
		</div>
	);
});
