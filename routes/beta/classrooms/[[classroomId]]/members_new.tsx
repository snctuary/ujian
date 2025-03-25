import { define } from "~/utils/server/core.ts";
import {
	ClassroomMemberFlags,
	retrieveClassroomMembers,
} from "~/utils/server/classrooms.ts";
import { page } from "fresh";
import { hasFlags } from "~/utils/server/flags.ts";
import { Partial } from "fresh/runtime";
import { memberRole } from "~/utils/client/memberRole.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const classroomId = ctx.state.currentClassroomId!;
		const members = await retrieveClassroomMembers(
			classroomId,
			true,
		);

		return page({
			classroomId,
			isHomeroom: hasFlags(ctx.state.currentClassroomMember!.flags, [
				ClassroomMemberFlags.HomeroomTeacher,
			]),
			members,
		});
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { isHomeroom, members } = data;

	return (
		<div class="flex flex-col gap-4 size-full">
			<div class="flex gap-1 justify-between">
				<form class="flex items-center gap-2 pl-2 bg-slate-100 rounded-xl focus:border border-black overflow-hidden grow max-w-64">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-search stroke-black"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						class="py-2 pr-2 outline-none placeholder:text-gray-500 bg-transparent grow"
						size={1}
						placeholder="Search members"
					/>
				</form>
				{isHomeroom && (
					<div>
						<button
							class="flex items-center gap-2 text-white font-medium px-4 py-2 bg-black rounded-xl"
							type="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.25"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-send-horizontal"
							>
								<path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
								<path d="M6 12h16" />
							</svg>
							<p>Invite</p>
						</button>
					</div>
				)}
			</div>
			<div class="size-full border border-gray-200 rounded-xl overflow-y-auto no-scrollbar">
				<Partial name="members">
					<table class="table-fixed w-full">
						<thead class="sticky top-0 backdrop-blur-md">
							<tr class="text-left border-gray-200 border-b">
								<th class="font-medium px-4 py-2">Classroom Member</th>
								<th class="font-medium w-36 px-4 py-2">Role</th>
							</tr>
						</thead>
						<tbody>
							{members.map((member) => (
								<tr class="hover:bg-slate-100 border-b">
									<td class="font-medium p-4">
										<div class="flex items-center gap-2">
											<img
												class="size-8 rounded-full"
												src={member.user.avatarUrl ?? "/default_avatar.png"}
											/>
											<p>{member.user.username}</p>
										</div>
									</td>
									<td class="font-medium p-4">{memberRole(member.flags)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</Partial>
			</div>
		</div>
	);
});
