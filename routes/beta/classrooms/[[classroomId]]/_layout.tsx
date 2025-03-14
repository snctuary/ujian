import { RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { ClassroomSwitcher } from "~/islands/beta/ClassroomSwitcher.tsx";
import { Partial } from "fresh/runtime";
import { hasFlags } from "~/utils/server/flags.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default define.page((ctx) => {
	const currentMember = ctx.state.currentClassroomMember!;
	return (
		<div
			class="flex flex-col md:flex-row h-full font-[Outfit] select-none no-scrollbar"
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
							<p class="pl-2 text-slate-500 text-sm mt-2">MAIN</p>
							<a
								class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2"
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
									class="lucide lucide-circle-dot"
								>
									<circle cx="12" cy="12" r="10" />
									<circle cx="12" cy="12" r="1" />
								</svg>
								<p>Tests</p>
							</a>
							<a
								class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2"
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
									class="lucide lucide-users-round"
								>
									<path d="M18 21a8 8 0 0 0-16 0" />
									<circle cx="10" cy="8" r="5" />
									<path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
								</svg>
								<p>Members</p>
							</a>
							{hasFlags(currentMember.flags, [ClassroomMemberFlags.Teacher]) &&
								(
									<a
										class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2"
										href={`/beta/classrooms/${ctx.state.currentClassroomId}/drafts`}
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
											class="lucide lucide-circle-dot-dashed"
										>
											<path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
											<path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
											<path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
											<path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
											<path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
											<path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
											<path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
											<path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
											<circle cx="12" cy="12" r="1" />
										</svg>
										<p>Drafts</p>
									</a>
								)}
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
