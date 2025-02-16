import { ClassroomMember } from "~/utils/server/classrooms.ts";
import { User } from "~/utils/server/user.ts";

interface Props {
	member: ClassroomMember;
	user: User;
}

export function ClassroomMemberItem({ user }: Props) {
	return (
		<div class="flex items-center p-2 rounded-lg hover:bg-slate-100 group transition-all ease-in-out duration-150">
			<div class="flex items-center gap-2">
				<div class="size-10 rounded-full bg-slate-100">
				</div>
				<p class="text-black">{user.username}</p>
			</div>
		</div>
	);
}
