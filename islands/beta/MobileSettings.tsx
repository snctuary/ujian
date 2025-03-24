import { User } from "~/utils/server/user.ts";
import { useState } from "preact/hooks";

interface Props {
	user: User;
}

export function MobileSettings({ user }: Props) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div class="relative md:hidden">
			<button
				class="flex items-center gap-1 rounded-full bg-gray-100 p-1"
				type="button"
				onClick={() => setOpen(!open)}
			>
				<div class="bg-slate-100 size-10 rounded-full overflow-hidden">
					<img class="size-full" src={user.avatarUrl} />
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					data-open={open}
					class="lucide lucide-chevron-down stroke-slate-400 data-[open=true]:rotate-180 transition-all ease-in-out duration-300"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			<div
				data-open={open}
				class="flex flex-col gap-2 divide-y divide-gray-200 w-64 bg-white border border-gray-200 shadow-lg rounded-xl absolute mt-4 -right-72 data-[open=true]:right-0 transition-all ease-in data-[open=true]:ease-out duration-200 data-[open=true]:duration-300"
				f-client-nav={false}
			>
				<div class="flex items-center justify-between p-4">
					<div class="flex items-center gap-2">
						<div class="bg-slate-100 size-8 rounded-full overflow-hidden">
							<img class="size-full" src={user.avatarUrl} />
						</div>
						<p class="text-sm font-bold">{user.username}</p>
					</div>
					<button
						class="bg-red-100 rounded-lg p-2"
						type="button"
						onClick={() => globalThis.location.href = "/auth/logout"}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-circle-arrow-out-up-right stroke-red-500"
						>
							<path d="M22 12A10 10 0 1 1 12 2" />
							<path d="M22 2 12 12" />
							<path d="M16 2h6v6" />
						</svg>
					</button>
				</div>
				<a
					class="flex justify-between items-center rounded-lg p-4 hover:bg-slate-100"
					href="/beta/settings"
				>
					<div class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-bolt"
						>
							<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
							<circle cx="12" cy="12" r="4" />
						</svg>
						<p>Settings</p>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.25"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-square-arrow-out-up-right"
					>
						<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
						<path d="m21 3-9 9" />
						<path d="M15 3h6v6" />
					</svg>
				</a>
			</div>
		</div>
	);
}
