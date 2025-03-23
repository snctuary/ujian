import { page, RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { ProfileEditor } from "~/islands/beta/ProfileEditor.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(ctx) {
		const user = ctx.state.user;

		if (!user) {
			return ctx.redirect("/beta/login");
		} else {
			return page({ user });
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { user } = data;

	return (
		<div class="flex flex-col h-full font-{Outfit] p-4">
			<div class="flex flex-col gap-2 size-full">
				<div class="flex items-center gap-2">
					<a href="/beta/classrooms">
						<div class="hover:bg-slate-100 rounded-xl p-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.75"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-chevron-left"
							>
								<path d="m15 18-6-6 6-6" />
							</svg>
						</div>
					</a>
					<p>Settings</p>
				</div>
				<div class="flex flex-col md:flex-row border border-gray-500 rounded-lg grow overflow-hidden">
					<div class="hidden md:flex flex-col w-64 h-full p-4 gap-2 overflow-y-auto no-scrollbar font-medium text-slate-500">
						<a
							class="flex items-center gap-2 rounded-lg hover:bg-slate-100 p-2 transition-all ease-in-out duration-150"
							href="#profile"
						>
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
								class="lucide lucide-at-sign"
							>
								<circle cx="12" cy="12" r="4" />
								<path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
							</svg>
							<p>My Profile</p>
						</a>
					</div>
					<div class="flex flex-col p-4 grow overflow-y-auto scroll-smooth no-scrollbar">
						<ProfileEditor
							currentAvatar={user.avatarUrl}
							username={user.username}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
