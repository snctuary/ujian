import { useEffect, useState } from "preact/hooks";
import { TestDraft } from "~/utils/server/tests.ts";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	classroomId: string;
	draft: TestDraft;
}

export function DraftEditor({ classroomId, draft }: Props) {
	const [editNameMode, setEditNameMode] = useState<boolean>(false);
	const [draftName, setDraftName] = useState<string>(draft.name);
	const [currentDraftName, setCurrentDraftName] = useState<string>(draft.name);

	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function changeName() {
		if (csrf && (draftName !== currentDraftName)) {
			const updatedDraft = await makeRequest<TestDraft>(
				`/beta/api/classrooms/${classroomId}/drafts/${draft.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({ name: draftName }),
					csrfToken: csrf,
				},
			);

			if (updatedDraft.ok && updatedDraft.data) {
				setDraftName(updatedDraft.data.name);
				setCurrentDraftName(updatedDraft.data.name);
				setEditNameMode(false);
			}
		}
	}

	return (
		<div class="flex flex-col min-h-full p-4 font-[Outfit]">
			<div class="flex justify-between items-center">
				<div class="flex items-center gap-2">
					<button
						class="hover:bg-slate-100 rounded-xl p-2"
						type="button"
						onClick={() =>
							globalThis.location.href =
								`/beta/classrooms/${classroomId}/drafts`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.75"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-chevron-left"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>
					<div class="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-xl">
						{!editNameMode
							? (
								<>
									<p>{currentDraftName}</p>
									<button type="button" onClick={() => setEditNameMode(true)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.75"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="lucide lucide-pen-line stroke-gray-400"
										>
											<path d="M12 20h9" />
											<path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
										</svg>
									</button>
								</>
							)
							: (
								<>
									<input
										class="bg-transparent outline-none"
										onInput={(input) => setDraftName(input.currentTarget.value)}
										value={draftName}
									/>
									<button type="button" onClick={() => changeName()}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="lucide lucide-check stroke-gray-600"
										>
											<path d="M20 6 9 17l-5-5" />
										</svg>
									</button>
									<button
										type="button"
										onClick={() => {
											setEditNameMode(false);
											setDraftName(currentDraftName);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="lucide lucide-x stroke-gray-600"
										>
											<path d="M18 6 6 18" />
											<path d="m6 6 12 12" />
										</svg>
									</button>
								</>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}
