import {
	ClassroomMember,
	ClassroomMemberFlags,
	EditMemberData,
} from "~/utils/server/classrooms.ts";
import { User } from "~/utils/server/user.ts";
import { memberRole } from "~/utils/client/memberRole.ts";
import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	classroomId: string;
	isHomeroom: boolean;
	initialMembers: (ClassroomMember & { user: User })[];
}

export function MembersTable(
	{ classroomId, isHomeroom, initialMembers }: Props,
) {
	const [members, setMembers] = useState<(ClassroomMember & { user: User })[]>(
		initialMembers,
	);
	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function changeRole(
		memberId: string,
		flags: ClassroomMemberFlags.Teacher | ClassroomMemberFlags.Student,
	) {
		if (csrf) {
			const response = await makeRequest<ClassroomMember>(
				`/beta/api/classrooms/${classroomId}/members/${memberId}`,
				{
					method: "PATCH",
					body: JSON.stringify({ flags } satisfies Partial<EditMemberData>),
					csrfToken: csrf,
				},
			);

			if (response.ok && response.data) {
				setMembers(
					members.map((member) =>
						member.userId === response.data?.userId
							? { ...response.data, user: member.user }
							: member
					),
				);
			}
		}
	}

	return (
		<div class="flex flex-col gap-4 size-full">
			<div class="flex gap-1 justify-between">
				<div class="flex items-center gap-2 pl-2 bg-slate-100 rounded-xl focus:border border-black overflow-hidden grow max-w-64">
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
						class="py-2 pr-2 outline-none placeholder:text-gray-500 bg-transparent grow disabled:opacity-50"
						size={1}
						disabled
						placeholder="Available soon"
					/>
				</div>
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
				<table class="table-fixed w-full">
					<thead class="sticky top-0 backdrop-blur-md">
						<tr class="text-left border-gray-200 border-b">
							<th class="font-medium px-4 py-2">Members</th>
							<th class="font-medium w-40 px-4 py-2">Role</th>
						</tr>
					</thead>
					<tbody>
						{members.map((member) => (
							<tr class="hover:bg-slate-100/50 border-b">
								<td class="font-medium p-4">
									<div class="flex items-center gap-2">
										<img
											class="size-8 rounded-full"
											src={member.user.avatarUrl ?? "/default_avatar.png"}
										/>
										<p>{member.user.username}</p>
									</div>
								</td>
								<td>
									<div class="relative group pr-4">
										<div class="flex items-center gap-1 rounded-lg hover:bg-slate-100 p-2">
											{memberRole(member.flags)}
										</div>
										<div class="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border group-hover:border-gray-200 divide-y divide-gray-200 absolute -left-4 -top-6 w-0 group-hover:w-full opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200">
											<button
												data-selected={member.flags === 1 << 2}
												class="flex justify-between items-center data-[selected=true]:font-semibold px-3 py-2 hover:bg-slate-100 group relative"
												type="button"
												onClick={() => changeRole(member.userId, 1 << 2)}
											>
												<p>Teacher</p>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2.5"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="lucide lucide-check-icon lucide-check opacity-0 group-data-[selected=true]:opacity-100"
												>
													<path d="M20 6 9 17l-5-5" />
												</svg>
											</button>
											<button
												data-selected={member.flags === 1 << 3}
												class="flex justify-between items-center data-[selected=true]:font-semibold px-3 py-2 hover:bg-slate-100 group relative"
												type="button"
												onClick={() => changeRole(member.userId, 1 << 3)}
											>
												<p>Student</p>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2.5"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="lucide lucide-check-icon lucide-check opacity-0 group-data-[selected=true]:opacity-100"
												>
													<path d="M20 6 9 17l-5-5" />
												</svg>
											</button>
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
