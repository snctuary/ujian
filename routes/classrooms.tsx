import { page } from "fresh";
import { define } from "~/utils/core.ts";
import { retrieveJoinedClassrooms } from "~/utils/classrooms.ts";
import { ClassroomItem } from "~/components/ClassroomItem.tsx";

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

	return (
		<div class="flex flex-col">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
				{classrooms.map((classroom) => (
					<ClassroomItem
						classroom={classroom}
						homeroomTeacher={classroom.homeroomTeacher}
					/>
				))}
			</div>
		</div>
	);
});
