import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { CreateClassroomData } from "~/routes/api/classrooms/index.ts";
import { Classroom } from "~/utils/server/classrooms.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

export function CreateClassroom() {
	const [creating, setCreating] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>();

	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function createClassroom() {
		if (name && csrf) {
			setCreating(true);
			const data: CreateClassroomData = {
				name,
			};
			const body = JSON.stringify(data);
			const classroom = await makeRequest<Classroom>("/api/classrooms", {
				method: "POST",
				body,
				csrfToken: csrf,
			});

			if (classroom.data) {
				globalThis.location.href =
					`/beta/classrooms/${classroom.data.id}/tests`;
			}
			setCreating(false);
		}
	}

	return (
		<div class="relative">
			<button
				class="flex justify-center items-center rounded-xl border border-gray-300 size-8 shadow-md"
				onClick={() => setOpen(true)}
				type="button"
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
					class="lucide lucide-plus stroke-gray-400"
				>
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
			</button>
			{open && (
				<div class="flex flex-col bg-white rounded-xl px-5 py-4 gap-1 w-60 absolute top-0 right-0 md:-right-1.5 left-[-180px] md:left-0 shadow-sm border border-gray-200">
					<div class="flex justify-between items-center">
						<p class="font-semibold">Create Classroom</p>
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
					<p class="text-sm mt-1">
						Start a new classroom
					</p>
					<input
						class="flex outline-none bg-slate-100 rounded-xl px-2 py-1 placeholder:text-gray-400"
						onInput={(input) => setName(input.currentTarget.value)}
						placeholder="My Classroom"
						size={1}
					/>
					<button
						class="flex justify-center px-3 py-2 mt-1 rounded-xl bg-gray-950 text-white text-sm font-semibold disabled:opacity-50"
						onClick={() => createClassroom()}
						disabled={creating || !name || !csrf}
						type="button"
					>
						{!creating ? <p>Create</p> : (
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
								class="lucide lucide-loader-circle animate-spin stroke-white"
							>
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
						)}
					</button>
				</div>
			)}
		</div>
	);
}
