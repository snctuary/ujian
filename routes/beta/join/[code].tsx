import { define } from "~/utils/server/core.ts";
import {
	findClassroomByInvite,
	retrieveClassroom,
	retrieveClassroomMember,
} from "~/utils/server/classrooms.ts";
import { HttpError, page, RouteConfig } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { retrieveUser } from "~/utils/server/user.ts";
import { RespondInvite } from "~/islands/beta/RespondInvite.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const { code } = ctx.params;
		const user = ctx.state.user;

		if (!user) {
			return ctx.redirect("/beta/login");
		} else {
			const classroomId = await findClassroomByInvite(code);

			if (!classroomId) {
				throw new HttpError(STATUS_CODE.NotFound, "Invalid Invite");
			} else {
				const member = await retrieveClassroomMember(classroomId, user.id);
				const redirectToClassroom = ctx.redirect(
					`/beta/classrooms/${classroomId}/tests`,
				);

				if (member) {
					return redirectToClassroom;
				} else {
					const classroom = await retrieveClassroom(classroomId, true);
					const homeroom = await retrieveUser(
						classroom.homeroomTeacherId,
						true,
					);
					return page({ classroom, homeroom });
				}
			}
		}
	},
});

export default define.page<typeof handler>((ctx) => {
	const { classroom, homeroom } = ctx.data;

	return (
		<div class="flex flex-col justify-center items-center gap-3 p-3 min-h-full no-scrollbar font-[Outfit]">
			<div class="size-32 bg-slate-100 rounded-full"></div>
			<p class="font-semibold text-xl">
				<span class="font-bold">{homeroom.username}</span> invited you to join
			</p>
			<div class="flex justify-center w-96 bg-slate-100 p-3 rounded-xl">
				<p class="font-black font-mono text-2xl">{classroom.name}</p>
			</div>
			<RespondInvite code={ctx.params.code} />
		</div>
	);
});
