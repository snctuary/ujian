import { page } from "fresh";
import { define } from "~/utils/core.ts";
import { retrieveJoinedClassrooms } from "~/utils/classrooms.ts";
import { ClassroomList } from "~/islands/ClassroomsList.tsx";

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

	return <ClassroomList classrooms={classrooms} />;
});
