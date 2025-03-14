import { RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { ClassroomSwitcher } from "~/islands/beta/ClassroomSwitcher.tsx";
import { Partial } from "fresh/runtime";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default define.page((ctx) => {
	return (
		<div
			class="flex flex-col md:flex-row h-full font-[Outfit] no-scrollbar"
			f-client-nav
		>
			<div class="hidden md:flex flex-col gap-3 p-3 bg-slate-50">
				<ClassroomSwitcher
					currentClassroomId={ctx.state.currentClassroomId}
					classrooms={ctx.state.classrooms}
				/>
				<div class="flex flex-col gap-1 font-medium grow">
					{ctx.state.currentClassroomId && (
						<>
							<a
								class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-lg p-2"
								href={`/beta/classrooms/${ctx.state.currentClassroomId}/tests`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.75"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-sticky-note"
								>
									<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
									<path d="M15 3v4a2 2 0 0 0 2 2h4" />
								</svg>
								<p>Tests</p>
							</a>
							<a
								class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-lg p-2"
								href={`/beta/classrooms/${ctx.state.currentClassroomId}/members`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.75"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-users"
								>
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
									<path d="M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
								<p>Members</p>
							</a>
						</>
					)}
				</div>
			</div>
			<div class="flex flex-col grow p-4">
				<Partial name="content">
					<ctx.Component />
				</Partial>
			</div>
		</div>
	);
});
