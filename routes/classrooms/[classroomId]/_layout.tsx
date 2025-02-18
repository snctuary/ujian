import { RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { Back } from "~/islands/Back.tsx";
import { ClassroomNavigation } from "~/components/ClassroomNavigation.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default define.page((ctx) => {
	const classroom = ctx.state.classroom!;

	return (
		<div class="flex flex-col h-full p-4 gap-4 select-none">
			<Back label={classroom.name} path="/classrooms" />
			<div class="flex flex-col gap-2">
				<p class="font-extrabold text-4xl">{classroom.name}</p>
				<div class="flex items-center gap-2">
					<div class="bg-slate-100 size-8 rounded-full"></div>
					<p class="font-semibold">{classroom.homeroomTeacher.username}</p>
				</div>
			</div>
			<div
				class="flex flex-col md:flex-row gap-2 grow overflow-y-auto"
				f-client-nav
			>
				<ClassroomNavigation classroomId={classroom.id} />
				<div class="grow">
					<div class="flex flex-col size-full overflow-y-auto no-scrollbar">
						<ctx.Component />
					</div>
				</div>
			</div>
		</div>
	);
});
