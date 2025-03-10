import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	code: string;
}

export function RespondInvite({ code }: Props) {
	const [joining, setJoining] = useState<boolean>(false);
	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function acceptInvite() {
		if (csrf) {
			setJoining(true);
			const response = await makeRequest<{ classroomId: string }>(
				`/beta/api/join/${code}`,
				{
					csrfToken: csrf,
					method: "POST",
				},
			);

			if (response.ok && response.data) {
				globalThis.location.href =
					`/beta/classrooms/${response.data.classroomId}`;
			} else {
				setJoining(false);
			}
		}
	}

	return (
		<div class="flex flex-col mt-4 font-semibold">
			<button
				class="flex justify-center items-center w-80 h-12 rounded-full bg-gray-950 hover:bg-gray-900 text-white disabled:opacity-50"
				type="button"
				disabled={joining}
				onClick={() => acceptInvite()}
			>
				{!joining ? <p>Accept Invite</p> : (
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
						class="lucide lucide-loader-circle animate-spin stroke-white self-center w-full"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
				)}
			</button>
			<button
				class="p-2 data-[joining=true]:p-0 data-[joining=true]:text-xs data-[joining=true]:opacity-0 transition-all ease-in-out duration-150"
				data-joining={joining}
				type="button"
				onClick={() => globalThis.location.href = "/beta/classrooms"}
			>
				<p>No, Thanks</p>
			</button>
		</div>
	);
}
