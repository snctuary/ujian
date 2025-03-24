import { useState } from "preact/hooks";
import { makeRequest } from "~/utils/client/makeRequest.ts";
import { CreateTestOptions, Test } from "~/utils/server/tests.ts";

interface Props {
	classroomId: string;
	draftId: string;
	totalQuestions: number;
	synced: boolean;
	csrf?: string;
}

export function PublishTest(
	{ classroomId, draftId, totalQuestions, synced, csrf }: Props,
) {
	const [open, setOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [publishing, setPublishing] = useState<boolean>(false);

	const availableDuration = [
		1000 * 60 * 10,
		1000 * 60 * 15,
		1000 * 60 * 30,
		1000 * 60 * 60,
		1000 * 60 * 60 * 2,
		1000 * 60 * 60 * 6,
	];
	const [duration, setDuration] = useState<number>(availableDuration.at(0)!);

	const eligible = !publishing && name && duration && synced && totalQuestions;
	async function publish() {
		if (csrf && eligible) {
			setPublishing(true);
			const response = await makeRequest<Test>(
				`/beta/api/classrooms/${classroomId}/tests`,
				{
					method: "POST",
					body: JSON.stringify(
						{ name, duration, templateId: draftId } satisfies CreateTestOptions,
					),
					csrfToken: csrf,
				},
			);

			if (response.ok) {
				globalThis.location.href = `/beta/classrooms/${classroomId}/tests`;
			}
		}
	}

	return (
		<div class="relative">
			<button
				class="px-4 py-2 rounded-lg bg-slate-950 disabled:opacity-50"
				type="button"
				disabled={!csrf}
				onClick={() => setOpen(!open)}
			>
				<p class="text-white font-medium">Publish</p>
			</button>
			{open && (
				<div class="flex flex-col gap-2 w-72 md:w-96 p-3 rounded-xl bg-white border border-gray-200 absolute mt-2 right-0 shadow-md">
					<div class="flex justify-between items-start gap-2">
						<div class="flex flex-col">
							<p class="font-semibold">Publish Test</p>
							<p class="text-slate-500 text-sm">
								Share this test to your students
							</p>
						</div>
						<button type="reset" onClick={() => setOpen(false)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-x stroke-slate-500 hover:stroke-slate-800"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
					<div class="flex flex-col">
						<label class="text-slate-700 text-sm font-medium" for="name">
							Test Name
						</label>
						<input
							id="name"
							name="name"
							class="flex bg-slate-100 px-2 py-1 rounded-lg outline-none border focus:border-gray-400"
							type="text"
							onInput={(input) => setName(input.currentTarget.value)}
						/>
					</div>
					<div class="flex flex-col">
						<p class="text-slate-700 text-sm font-medium">Duration</p>
						<div class="flex gap-2">
							<button
								class="w-1/5 py-1 rounded-lg font-medium bg-slate-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
								type="button"
								data-selected={duration === availableDuration.at(0)}
								onClick={() => setDuration(availableDuration.at(0)!)}
							>
								10m
							</button>
							<button
								class="w-1/5 py-1 rounded-lg font-medium bg-slate-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
								type="button"
								data-selected={duration === availableDuration.at(1)}
								onClick={() => setDuration(availableDuration.at(1)!)}
							>
								15m
							</button>
							<button
								class="w-1/5 py-1 rounded-lg font-medium bg-slate-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
								type="button"
								data-selected={duration === availableDuration.at(2)}
								onClick={() => setDuration(availableDuration.at(2)!)}
							>
								30m
							</button>
							<button
								class="w-1/5 py-1 rounded-lg font-medium bg-slate-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
								type="button"
								data-selected={duration === availableDuration.at(3)}
								onClick={() => setDuration(availableDuration.at(3)!)}
							>
								1h
							</button>
							<button
								class="w-1/5 py-1 rounded-lg font-medium bg-slate-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
								type="button"
								data-selected={duration === availableDuration.at(4)}
								onClick={() => setDuration(availableDuration.at(4)!)}
							>
								2h
							</button>
							<button
								class="w-1/5 py-1 rounded-lg font-medium bg-slate-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
								type="button"
								data-selected={duration === availableDuration.at(5)}
								onClick={() => setDuration(availableDuration.at(5)!)}
							>
								6h
							</button>
						</div>
					</div>
					<button
						class="flex justify-center py-2 bg-black rounded-lg disabled:opacity-50"
						type="button"
						disabled={!eligible}
						onClick={() => publish()}
					>
						<p class="text-white font-medium">Publish</p>
					</button>
				</div>
			)}
		</div>
	);
}
