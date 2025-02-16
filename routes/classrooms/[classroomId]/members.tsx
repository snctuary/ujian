import { define } from "~/utils/server/core.ts";
import { retrieveClassroomMembers } from "~/utils/server/classrooms.ts";
import { page } from "fresh";
import { Partial } from "fresh/runtime";
import { ClassroomMemberItem } from "~/components/ClassroomMemberItem.tsx";

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const members = await retrieveClassroomMembers(classroom.id, true);

		return page({ members });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { members } = data;

	return (
		<Partial name="content">
			<div class="flex flex-col gap-1">
				{members.map((member) => (
					<ClassroomMemberItem member={member} user={member.user} />
				))}
			</div>
		</Partial>
	);
});
