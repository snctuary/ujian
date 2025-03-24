import { define } from "~/utils/server/core.ts";
import { searchMembers } from "~/utils/server/classrooms.ts";
import { page, RouteConfig } from "fresh";
import { Partial } from "fresh/runtime";
import { memberRole } from "~/utils/client/memberRole.ts";

export const config: RouteConfig = {
	skipAppWrapper: true,
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const query = ctx.url.searchParams.get("q");
		const members = await searchMembers(classroomId, query ?? "", true);

		return page({ members });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { members } = data;

	return (
		<Partial name="members">
			<table class="table-auto text-center w-full">
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
									<div class="size-8 bg-gray-100 rounded-full overflow-hidden">
										{member.user.avatarUrl && (
											<img class="size-full" src={member.user.avatarUrl} />
										)}
									</div>
									{member.user.username}
								</div>
							</td>
							<td class="border-b border-gray-300 h-14">
								{memberRole(member.flags) ?? "Unknown"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Partial>
	);
});
