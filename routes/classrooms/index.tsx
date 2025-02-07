import { page } from "fresh";
import { define } from "~/utils/server/core.ts";
import { retrieveJoinedClassrooms } from "~/utils/server/classrooms.ts";
import { ClassroomListV2 } from "~/islands/ClassroomsListV2.tsx";

export const handler = define.handlers({
	async GET(ctx) {
		ctx.state.title = "Classrooms";

		const classrooms = await retrieveJoinedClassrooms(
			ctx.state.user!.id,
			true,
		);

		return page({ classrooms });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classrooms } = data;

	return <ClassroomListV2 classrooms={classrooms} />;
});
