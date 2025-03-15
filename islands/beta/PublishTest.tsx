import { useState } from "preact/hooks";

interface Props {
	classroomId: string;
	draftId: string;
	csrf?: string;
}

export function PublishTest({ classroomId, draftId, csrf }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>();

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
				<form
					action={`/beta/api/classrooms/${classroomId}/tests`}
					method="POST"
					class="flex flex-col gap-2 w-72 md:w-96 p-3 rounded-xl bg-white border border-gray-200 absolute mt-2 right-0 shadow-md"
				>
					<input class="hidden" name="_csrf" value={csrf} />
					<input class="hidden" name="templateId" value={draftId} />
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
						<div class="flex items-center relative">
							<select
								name="duration"
								class="flex items-center w-full bg-slate-100 px-2 py-1 rounded-lg outline-none border focus:border-gray-400 appearance-none"
							>
								<option value={10}>10 minutes</option>
								<option value={15}>15 minutes</option>
								<option value={20}>20 minutes</option>
								<option value={30}>30 minutes</option>
								<option value={60}>1 hour</option>
								<option value={120}>2 hours</option>
								<option value={360}>6 hours</option>
							</select>
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
								class="lucide lucide-chevron-down absolute right-0 pr-2"
							>
								<path d="m6 9 6 6 6-6" />
							</svg>
						</div>
					</div>
					<button
						class="flex justify-center py-2 bg-black rounded-lg disabled:opacity-50"
						type="submit"
						disabled={!name}
					>
						<p class="text-white font-medium">Publish</p>
					</button>
				</form>
			)}
		</div>
	);
}
