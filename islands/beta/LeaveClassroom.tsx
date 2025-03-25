import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	classroomId: string;
}

export function LeaveClassroom({ classroomId }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [leaving, setLeaving] = useState<boolean>(false);

	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function leaveClassroom() {
		if (csrf && !leaving) {
			setLeaving(true);
			const response = await makeRequest(
				`/beta/api/classrooms/${classroomId}/members/me`,
				{
					method: "DELETE",
					csrfToken: csrf,
				},
			);

			if (response.ok) {
				globalThis.location.href = "/beta/classrooms";
			}
		}
	}

	return (
		<>
			<button
				class="hidden md:flex items-center gap-2 text-red-500 fill-current rounded-xl p-2 hover:bg-red-100 transition-all ease-in-out duration-100"
				type="button"
				onClick={() => setOpen(true)}
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
					class="lucide lucide-circle-arrow-out-up-right"
				>
					<path d="M22 12A10 10 0 1 1 12 2" />
					<path d="M22 2 12 12" />
					<path d="M16 2h6v6" />
				</svg>
				<p>Leave</p>
			</button>
			<button
				class="flex md:hidden items-center gap-2 hover:bg-red-100 rounded-lg px-3 py-2 text-red-500"
				type="button"
				onClick={() => setOpen(true)}
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
					class="lucide lucide-circle-arrow-out-up-right"
				>
					<path d="M22 12A10 10 0 1 1 12 2" />
					<path d="M22 2 12 12" />
					<path d="M16 2h6v6" />
				</svg>
				<p>Leave</p>
			</button>
			{open && (
				<div class="fixed inset-0 flex justify-center items-center bg-black/75 p-4">
					<div class="flex flex-col justify-center items-center p-4 rounded-xl bg-white">
						<div class="flex justify-center items-center bg-red-100 rounded-full size-16">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-triangle-alert stroke-red-500"
							>
								<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
								<path d="M12 9v4" />
								<path d="M12 17h.01" />
							</svg>
						</div>
						<div class="flex flex-col items-center gap-0 mt-4 text-center">
							<p class="font-semibold">
								Are you sure want to leave this classroom?
							</p>
							<p class="text-gray-500 text-sm -mt-1">
								You can always rejoin anytime
							</p>
						</div>
						<div class="flex flex-col w-full gap-2 mt-4 font-medium">
							<button
								class="flex justify-center items-center rounded-lg bg-red-500 text-white shadow-lg p-1 disabled:opacity-50 hover:bg-red-400 transition-all ease-in-out duration-200"
								type="button"
								disabled={leaving}
								onClick={() => leaveClassroom()}
							>
								<p>Leave</p>
							</button>
							<button
								class="flex justify-center items-center rounded-lg border border-gray-200 shadow-lg p-1 disabled:opacity-50 hover:bg-gray-100 transition-all ease-in-out duration-200"
								type="button"
								disabled={leaving}
								onClick={() => setOpen(false)}
							>
								<p>Cancel</p>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
