import { useEffect, useState } from "preact/hooks";
import { TestDraft, TestQuestion } from "~/utils/server/tests.ts";
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
	const [questions, setQuestions] = useState<TestQuestion[]>(draft.questions);
	const [defaultChoices, setDefaultChoices] = useState<number>(2);
	const [justLoaded, setJustLoaded] = useState<boolean>(true);
	const [synced, setSynced] = useState<boolean>(true);

	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function editDraft() {
		if (csrf) {
			const response = await makeRequest<TestDraft>(
				`/beta/api/classrooms/${classroomId}/drafts/${draft.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({ questions }),
					csrfToken: csrf,
				},
			);

			if (response.ok) {
				setSynced(true);
			}
		}
	}

	useEffect(() => {
		if (!justLoaded) {
			setSynced(false);
		}
		setJustLoaded(false);
		const saveDraft = setTimeout(() => editDraft(), 3_000);
		return () => clearTimeout(saveDraft);
	}, [questions]);

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
		<div class="flex flex-col size-full p-4 divide-y divide-gray-200 overflow-y-auto font-[Outfit]">
			<div class="flex justify-between items-center pb-4">
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
										onKeyDown={(key) => {
											if (key.code === "Enter") {
												changeName();
											}
										}}
										value={draftName}
									/>
									{draftName !== currentDraftName && (
										<button
											type="button"
											onClick={() => changeName()}
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
												class="lucide lucide-check stroke-gray-600"
											>
												<path d="M20 6 9 17l-5-5" />
											</svg>
										</button>
									)}
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
				<div class="flex gap-2 p-2">
					{!synced
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
								class="lucide lucide-refresh-cw stroke-slate-500 animate-spin"
							>
								<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
								<path d="M21 3v5h-5" />
								<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
								<path d="M8 16H3v5" />
							</svg>
						)
						: (
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
								class="lucide lucide-cloudy stroke-slate-500"
							>
								<path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
								<path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" />
							</svg>
						)}
				</div>
			</div>
			<div class="flex flex-col grow overflow-y-auto gap-3 px-2 py-3 no-scrollbar relative">
				{questions.map((question, questionIndex) => (
					<div class="flex flex-col rounded-md border border-slate-400 px-4 py-3 gap-2 shadow-md">
						<p class="font-semibold">Question {questionIndex + 1}</p>
						<textarea
							class="p-2 font-medium resize-none bg-slate-50 hover:bg-slate-100 rounded-lg outline-none mb-4 no-scrollbar"
							onInput={(input) =>
								setQuestions(
									questions.with(questionIndex, {
										...question,
										question: input.currentTarget.value,
									}),
								)}
							value={question.question}
						/>
						{question.choices.map((choice, choiceIndex) => (
							<div class="flex items-center gap-2">
								<button
									data-correct={choice.correctChoice}
									class="flex justify-center items-center bg-gray-200 data-[correct=true]:bg-gray-950 size-6 rounded-full"
									type="button"
									onClick={() =>
										setQuestions(
											questions.with(questionIndex, {
												...question,
												choices: question.choices.map((c, index) => ({
													...c,
													correctChoice: index === choiceIndex,
												})),
											}),
										)}
								>
									{choice.correctChoice && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="lucide lucide-check"
										>
											<path d="M20 6 9 17l-5-5" />
										</svg>
									)}
								</button>
								<input
									class="bg-slate-50 hover:bg-slate-100 p-2 grow rounded-lg outline-slate-200 outline-1"
									size={1}
									onInput={(input) =>
										setQuestions(
											questions.with(questionIndex, {
												...question,
												choices: question.choices.with(choiceIndex, {
													...choice,
													value: input.currentTarget.value,
												}),
											}),
										)}
									value={choice.value}
								/>
								<button
									class="p-1 group"
									disabled={question.choices.length <= 2 ||
										choice.correctChoice}
									type="button"
									onClick={() => {
										setQuestions(
											questions.with(questionIndex, {
												...question,
												choices: question.choices.filter((_, index) =>
													index !== choiceIndex
												),
											}),
										);
										setDefaultChoices(question.choices.length - 1);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-trash-2 stroke-red-500 group-disabled:stroke-gray-400"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										<line x1="10" x2="10" y1="11" y2="17" />
										<line x1="14" x2="14" y1="11" y2="17" />
									</svg>
								</button>
							</div>
						))}
						<div>
							<button
								class="flex items-center gap-2 px-3 py-2 border-2 border-slate-400 border-dashed rounded-lg text-black"
								type="button"
								onClick={() => {
									setQuestions(
										questions.with(questionIndex, {
											...question,
											choices: [...question.choices, {
												correctChoice: false,
												value: "New Choice",
											}],
										}),
									);
									setDefaultChoices(question.choices.length + 1);
								}}
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
									class="lucide lucide-plus"
								>
									<path d="M5 12h14" />
									<path d="M12 5v14" />
								</svg>
								<p class="font-medium">Add Choice</p>
							</button>
						</div>
					</div>
				))}
			</div>
			<button
				class="flex gap-1 justify-center items-center p-3 bg-gray-950 rounded-xl text-white"
				type="button"
				onClick={() => {
					const presetChoices = [{ correctChoice: true, value: "An answer" }];

					while (presetChoices.length < defaultChoices) {
						presetChoices.push({
							correctChoice: false,
							value: "Another answer",
						});
					}

					setQuestions([...questions, {
						question: "Ask a Question...",
						choices: presetChoices,
					}]);
				}}
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
					class="lucide lucide-plus"
				>
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
				<p>Add Question</p>
			</button>
		</div>
	);
}
