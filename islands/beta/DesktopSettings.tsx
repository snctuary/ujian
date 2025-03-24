import { User } from "~/utils/server/user.ts";

interface Props {
	user: User;
}

export function DesktopSettings({ user }: Props) {
	return (
		<div class="hidden md:flex justify-between items-center p-4 rounded-xl bg-white shadow-lg border border-gray-200 group">
			<div class="flex items-center gap-2">
				{user.avatarUrl && (
					<img class="size-8 rounded-full" src={user.avatarUrl} />
				)}
				<p class="font-bold">{user.username}</p>
			</div>
			<div
				class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300"
				f-client-nav={false}
			>
				<a class="hover:bg-slate-100 p-2 rounded-lg" href="/beta/settings">
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
						class="lucide lucide-bolt"
					>
						<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
						<circle cx="12" cy="12" r="4" />
					</svg>
				</a>
				<button
					class="hover:bg-red-100 p-2 rounded-lg"
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
						stroke-width="2.25"
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
		</div>
	);
}
