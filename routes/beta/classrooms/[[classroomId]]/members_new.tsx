import { define } from "~/utils/server/core.ts";
import {
	ClassroomMemberFlags,
	retrieveClassroomMembers,
} from "~/utils/server/classrooms.ts";
import { page } from "fresh";
import { hasFlags } from "~/utils/server/flags.ts";
import { MembersTable } from "~/islands/beta/MembersTable.tsx";

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
	const { classroomId, isHomeroom, members } = data;

	return (
		<MembersTable
			classroomId={classroomId}
			isHomeroom={isHomeroom}
			initialMembers={members}
		/>
	);
});
