import { RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { ClassroomSwitcher } from "~/islands/beta/ClassroomSwitcher.tsx";
import { Partial } from "fresh/runtime";
import { hasFlags } from "~/utils/server/flags.ts";
import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";
import { MobileSettings } from "~/islands/beta/MobileSettings.tsx";
import { DesktopSettings } from "~/islands/beta/DesktopSettings.tsx";
import { LeaveClassroom } from "~/islands/beta/LeaveClassroom.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default define.page((ctx) => {
	const currentMember = ctx.state.currentClassroomMember!;

	return (
		<div
			class="flex flex-col md:flex-row h-full font-[Outfit] select-none overflow-y-auto no-scrollbar"
			f-client-nav
		>
			<div class="flex flex-col grow p-4 overflow-y-auto">
				<Partial name="content">
					<ctx.Component />
				</Partial>
			</div>
			<div class="flex flex-col order-first gap-3 p-3 md:bg-slate-50">
				<div class="flex justify-between items-center">
					<ClassroomSwitcher
						currentClassroomId={ctx.state.currentClassroomId}
						classrooms={ctx.state.classrooms}
					/>
					<MobileSettings user={ctx.state.user!} />
				</div>
				{ctx.state.currentClassroomId && (
					<div class="flex md:hidden gap-2 overflow-x-auto rounded-lg no-scrollbar">
						<a
							class="group"
							href={`/beta/classrooms/${ctx.state.currentClassroomId}/tests`}
						>
							<div class="flex items-center gap-2 group-aria-[current]:bg-gray-950 hover:bg-slate-100 group-aria-[current]:hover:bg-gray-950 rounded-lg px-3 py-2 text-black group-aria-[current]:text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-circle-dot"
								>
									<circle cx="12" cy="12" r="10" />
									<circle cx="12" cy="12" r="1" />
								</svg>
								<p>Tests</p>
							</div>
						</a>
						<a
							class="group"
							href={`/beta/classrooms/${ctx.state.currentClassroomId}/members`}
						>
							<div class="flex items-center gap-2 group-aria-[current]:bg-gray-950 hover:bg-slate-100 group-aria-[current]:hover:bg-gray-950 rounded-lg px-3 py-2 text-black group-aria-[current]:text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-users-round"
								>
									<path d="M18 21a8 8 0 0 0-16 0" />
									<circle cx="10" cy="8" r="5" />
									<path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
								</svg>
								<p>Members</p>
							</div>
						</a>
						{hasFlags(currentMember.flags, [ClassroomMemberFlags.Teacher]) && (
							<a
								class="group"
								href={`/beta/classrooms/${ctx.state.currentClassroomId}/drafts`}
							>
								<div class="flex items-center gap-2 group-aria-[current]:bg-gray-950 hover:bg-slate-100 group-aria-[current]:hover:bg-gray-950 rounded-lg px-3 py-2 text-black group-aria-[current]:text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
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
								</div>
							</a>
						)}
						{hasFlags(currentMember.flags, [
								ClassroomMemberFlags.HomeroomTeacher,
							])
							? (
								<a
									class="group"
									href={`/beta/classrooms/${ctx.state.currentClassroomId}/settings`}
								>
									<div class="flex items-center gap-2 group-aria-[current]:bg-gray-950 hover:bg-slate-100 group-aria-[current]:hover:bg-gray-950 rounded-lg px-3 py-2 text-black group-aria-[current]:text-white">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="lucide lucide-bolt"
										>
											<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
											<circle cx="12" cy="12" r="4" />
										</svg>
										<p>Settings</p>
									</div>
								</a>
							)
							: <LeaveClassroom classroomId={ctx.state.currentClassroomId!} />}
					</div>
				)}
				<div class="hidden md:flex flex-col gap-1 font-medium grow">
					{ctx.state.currentClassroomId && (
						<>
							<p class="pl-2 text-slate-500 text-sm mt-2">MAIN</p>
							<a
								class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2 hover:bg-slate-200 transition-all ease-in-out duration-100"
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
								class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2 hover:bg-slate-200 transition-all ease-in-out duration-100"
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
										class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2 hover:bg-slate-200 transition-all ease-in-out duration-100"
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
							<p class="pl-2 text-slate-500 text-sm mt-2">MANAGEMENT</p>
							{hasFlags(currentMember.flags, [
								ClassroomMemberFlags.HomeroomTeacher,
							]) && (
								<a
									class="flex items-center gap-2 text-black aria-[current]:text-white aria-[current]:bg-black fill-current rounded-xl p-2 hover:bg-slate-200 transition-all ease-in-out duration-100"
									href={`/beta/classrooms/${ctx.state.currentClassroomId}/settings`}
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
										class="lucide lucide-bolt"
									>
										<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
										<circle cx="12" cy="12" r="4" />
									</svg>
									<p>Settings</p>
								</a>
							)}
							{!hasFlags(currentMember.flags, [
								ClassroomMemberFlags.HomeroomTeacher,
							]) && (
								<LeaveClassroom classroomId={ctx.state.currentClassroomId} />
							)}
						</>
					)}
				</div>
				<DesktopSettings user={ctx.state.user!} />
			</div>
		</div>
	);
});
