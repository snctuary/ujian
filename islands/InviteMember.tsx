import { IS_BROWSER } from "fresh/runtime";
import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";
import { ClassroomInvite } from "~/utils/server/classrooms.ts";

interface Props {
	classroomId: string;
}

export function InviteMember({ classroomId }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const [inviteCode, setInviteCode] = useState<string>();

	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function showInvite() {
		if (csrf) {
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

			setOpen(!open);
			setCopied(open);
		}
	}

	return (
		<div class="relative">
			<button
				class="px-6 py-2 h-full font-semibold bg-black text-white text-sm rounded-full"
				onClick={() => showInvite()}
				type="button"
			>
				Invite
			</button>
			{open && (
				<div class="flex flex-col justify-center items-center w-72 gap-2 p-4 bg-white rounded-lg border border-gray-400 absolute mt-4 right-0">
					<div class="flex justify-center items-center bg-slate-100 rounded-full size-20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							id="Layer_1"
							data-name="Layer 1"
							viewBox="0 0 24 24"
							width="24"
							height="24"
						>
							<path d="M3.914,11.545c.527,.639,.437,1.584-.202,2.111-.638,.528-1.584,.438-2.112-.201-1.032-1.25-1.601-2.832-1.601-4.455C0,5.141,3.14,2,7,2h4c3.86,0,7,3.141,7,7,0,3.118-2.094,5.888-5.091,6.736-.137,.039-.274,.057-.41,.057-.654,0-1.255-.431-1.442-1.092-.226-.797,.238-1.626,1.035-1.852,1.713-.484,2.909-2.067,2.909-3.85,0-2.206-1.794-4-4-4H7c-2.206,0-4,1.794-4,4,0,.941,.316,1.821,.914,2.545Zm18.485-1c-.528-.639-1.473-.729-2.112-.201-.639,.527-.729,1.473-.202,2.111,.598,.724,.914,1.604,.914,2.545,0,2.206-1.794,4-4,4h-4c-2.206,0-4-1.794-4-4,0-1.782,1.196-3.365,2.909-3.85,.797-.226,1.26-1.055,1.035-1.852-.226-.798-1.054-1.261-1.852-1.035-2.998,.849-5.091,3.618-5.091,6.736,0,3.859,3.14,7,7,7h4c3.86,0,7-3.141,7-7,0-1.623-.568-3.205-1.601-4.455Z" />
						</svg>
					</div>
					<p class="font-semibold">Invite People to Your Class</p>
					<p class="text-center text-slate-400 text-sm">
						Share this code to people<br /> you want to invite
					</p>
					<div class="flex w-full justify-center items-center bg-slate-100 p-2 font-semibold rounded-lg relative group">
						<p>{inviteCode}</p>
						<button
							class="absolute right-3 fill-slate-500 disabled:fill-green-500 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-150"
							disabled={copied}
							onClick={() => {
								if (IS_BROWSER && inviteCode) {
									navigator.clipboard.writeText(
										`${globalThis.location.host}/join/${inviteCode}`,
									);
									setCopied(true);
								}
							}}
							type="button"
						>
							{!copied
								? (
									<svg
										id="Layer_1"
										height="18"
										viewBox="0 0 24 24"
										width="18"
										xmlns="http://www.w3.org/2000/svg"
										data-name="Layer 1"
									>
										<path d="m13.5 19h-8a5.506 5.506 0 0 1 -5.5-5.5v-8a5.506 5.506 0 0 1 5.5-5.5h8a5.506 5.506 0 0 1 5.5 5.5v8a5.506 5.506 0 0 1 -5.5 5.5zm-8-16a2.5 2.5 0 0 0 -2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5h8a2.5 2.5 0 0 0 2.5-2.5v-8a2.5 2.5 0 0 0 -2.5-2.5zm18.5 15.5v-11.5a1.5 1.5 0 0 0 -3 0v11.5a2.5 2.5 0 0 1 -2.5 2.5h-11.5a1.5 1.5 0 0 0 0 3h11.5a5.506 5.506 0 0 0 5.5-5.5z" />
									</svg>
								)
								: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										version="1.1"
										id="Capa_1"
										x="0px"
										y="0px"
										viewBox="0 0 507.506 507.506"
										style="enable-background:new 0 0 507.506 507.506;"
										xml:space="preserve"
										width="18"
										height="18"
									>
										<g>
											<path d="M163.865,436.934c-14.406,0.006-28.222-5.72-38.4-15.915L9.369,304.966c-12.492-12.496-12.492-32.752,0-45.248l0,0   c12.496-12.492,32.752-12.492,45.248,0l109.248,109.248L452.889,79.942c12.496-12.492,32.752-12.492,45.248,0l0,0   c12.492,12.496,12.492,32.752,0,45.248L202.265,421.019C192.087,431.214,178.271,436.94,163.865,436.934z" />
										</g>
									</svg>
								)}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
