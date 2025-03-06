import { define } from "~/utils/server/core.ts";
import { retrieveClassroomMembers } from "~/utils/server/classrooms.ts";
import { page } from "fresh";
import { Partial } from "fresh/runtime";
import { ClassroomMemberItem } from "~/components/ClassroomMemberItem.tsx";
import { InviteMember } from "~/islands/InviteMember.tsx";

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const members = await retrieveClassroomMembers(classroom.id, true);

		return page({ classroom, members });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classroom, members } = data;

	return (
		<Partial name="content">
			<div class="flex flex-col gap-2 relative">
				<div class="flex gap-2 sticky top-0">
					<form
						class="flex items-center grow gap-3 fill-slate-500 px-4 rounded-lg relative bg-slate-100"
						method="GET"
						f-partial={`/partials/classrooms/${classroom.id}/members`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							version="1.1"
							id="Capa_1"
							x="0px"
							y="0px"
							viewBox="0 0 513.749 513.749"
							style="enable-background:new 0 0 513.749 513.749;"
							xml:space="preserve"
							width="18"
							height="18"
						>
							<g>
								<path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15   S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0   c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160   s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
							</g>
						</svg>
						<input class="grow py-3 bg-transparent outline-none" size={1} />
					</form>
					<InviteMember classroomId={classroom.id} />
				</div>
				{members.map((member) => (
					<ClassroomMemberItem member={member} user={member.user} />
				))}
			</div>
		</Partial>
	);
});
