import { useState } from "preact/hooks";

interface Props {
	loginMode?: boolean;
}

export function Onboarding({ loginMode }: Props) {
	const [username, setUsername] = useState<string>();

	return (
		<form
			class="flex flex-col justify-center gap-2 w-full max-w-64 mt-4"
			method="POST"
			f-client-nav={false}
		>
			<div class="flex w-full items-center relative text-slate-700">
				<input
					class="w-full bg-gray-200 pl-8 py-1.5 rounded-lg outline-none text-sm font-medium placeholder:font-normal placeholder:text-slate-400"
					name="username"
					type="text"
					placeholder="username"
					onInput={(input) =>
						setUsername(input.currentTarget.value.toLowerCase())}
					value={username}
				/>
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
					class="lucide lucide-at-sign absolute left-1.5"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
				</svg>
			</div>
			<div class="flex w-full items-center relative text-slate-700">
				<input
					class="w-full bg-gray-200 pl-8 py-1.5 rounded-lg outline-none text-sm font-medium placeholder:font-normal placeholder:text-slate-400"
					name="password"
					type="password"
					placeholder="Password"
				/>
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
					class="lucide lucide-asterisk absolute left-1.5"
				>
					<path d="M12 6v12" />
					<path d="M17.196 9 6.804 15" />
					<path d="m6.804 9 10.392 6" />
				</svg>
			</div>
			<button
				class="flex justify-center items-center py-2 bg-gray-900 rounded-lg text-white text-sm font-medium"
				type="submit"
			>
				{loginMode ? "Login" : "Get Started"}
			</button>
		</form>
	);
}
