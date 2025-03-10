import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";
import { ClassroomInvite } from "~/utils/server/classrooms.ts";

interface Props {
	classroomId: string;
}

export function Invite({ classroomId }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const [copyTimeout, setCopyTimeout] = useState<number>();
	const [inviteCode, setInviteCode] = useState<string>();
	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function showInvite() {
		if (csrf) {
			setOpen(!open);
			setCopied(false);
			if (copyTimeout) {
				clearTimeout(copyTimeout);
			}

			if (!inviteCode) {
				const fetchedInvite = await makeRequest<ClassroomInvite>(
					`/api/classrooms/${classroomId}/invite`,
					{
						csrfToken: csrf,
					},
				);

				if (fetchedInvite.ok) {
					setInviteCode(fetchedInvite.data?.inviteCode);
				} else {
					const createdInvite = await makeRequest<ClassroomInvite>(
						`/api/classrooms/${classroomId}/invite`,
						{
							method: "POST",
							csrfToken: csrf,
						},
					);

					if (createdInvite.ok) {
						setInviteCode(createdInvite.data?.inviteCode);
					}
				}
			}
		}
	}

	return (
		<div class="relative">
			{!open
				? (
					<button
						class="flex justify-center items-center rounded-xl border border-gray-300 shadow-md size-10"
						type="button"
						onClick={() => showInvite()}
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
							class="lucide lucide-send stroke-gray-400"
						>
							<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
							<path d="m21.854 2.147-10.94 10.939" />
						</svg>
					</button>
				)
				: (
					<div class="flex flex-col bg-white rounded-xl px-5 py-4 gap-2 w-96 absolute top-0 right-0 shadow-sm border border-gray-100">
						<div class="flex justify-between items-center">
							<p class="font-semibold text-lg">Invite Members</p>
							<button
								class="flex justify-center items-center bg-gray-950 fill-white size-8 rounded-xl"
								type="button"
								onClick={() => setOpen(false)}
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
									class="lucide lucide-x stroke-white"
								>
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
						</div>
						<p class="text-sm mt-3">
							Anyone who has this code can join this classroom
						</p>
						<div class="flex gap-2">
							<div class="flex items-center px-3 bg-slate-100 font-mono font-semibold rounded-lg grow">
								{!inviteCode
									? (
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
											class="lucide lucide-loader-circle animate-spin stroke-gray-400 self-center w-full"
										>
											<path d="M21 12a9 9 0 1 1-6.219-8.56" />
										</svg>
									)
									: <p>{inviteCode}</p>}
							</div>
							<button
								class="flex justify-center items-center px-4 py-3 rounded-xl bg-gray-950 disabled:opacity-50"
								disabled={!inviteCode}
								type="button"
								onClick={() => {
									navigator.clipboard.writeText(
										`${globalThis.location.host}/beta/join/${inviteCode}`,
									);
									setCopied(true);
									setCopyTimeout(setTimeout(() => setCopied(false), 3_000));
								}}
							>
								<p class="text-white text-sm font-semibold">
									{!copied ? "Copy" : "Copied"}
								</p>
							</button>
						</div>
					</div>
				)}
		</div>
	);
}
