import { PartialTestQuestion, Test } from "~/utils/server/tests.ts";
import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	data: Test & { classroomId: string; questions: PartialTestQuestion[] };
}

export function TestView({ data }: Props) {
	const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
	const [choices, setChoices] = useState<(number | null)[]>(
		data.questions.map(() => null),
	);
	const currentQuestion = data.questions.at(currentQuestionId)!;
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function turnIn() {
		if (csrf && !choices.includes(null)) {
			setIsSubmit(true);
			const response = await makeRequest(
				`/beta/api/classrooms/${data.classroomId}/tests/${data.id}/answers`,
				{
					method: "POST",
					body: JSON.stringify(choices),
					csrfToken: csrf,
				},
			);

			if (response.ok) {
				globalThis.location.href = `/beta/classrooms/${data.classroomId}/tests`;
			}
			setIsSubmit(false);
		}
	}

	return (
		<div class="flex flex-col h-full gap-3 py-4">
			<div class="flex flex-col gap-2 px-4">
				<div class="bg-gray-100 w-full h-3 rounded-full overflow-hidden">
					<div
						class="transition-all ease-in-out duration-300 h-full bg-purple-500 rounded-full"
						style={`width: ${
							(100 / data.totalQuestions) * choices.filter((ctx) =>
								ctx !== null
							).length
						}%`}
					>
					</div>
				</div>
			</div>
			<div class="flex flex-col grow gap-2 p-4 overflow-y-auto relative">
				<div class="flex flex-col font-semibold mb-6">
					<p class="text-sm text-slate-500">Question {currentQuestionId + 1}</p>
					<p class="text-2xl">{currentQuestion.question}</p>
				</div>
				{currentQuestion.choices.map((choice, choiceIndex) => (
					<button
						type="button"
						onClick={() =>
							setChoices(choices.with(currentQuestionId, choiceIndex))}
					>
						<div
							data-selected={choices.at(currentQuestionId) === choiceIndex}
							class="flex p-4 rounded-lg shadow-md data-[selected=true]:bg-black data-[selected=true]:text-white data-[selected=true]:border-none border border-gray-200"
						>
							<p class="text-lg font-medium">{choice}</p>
						</div>
					</button>
				))}
			</div>
			<div class="flex justify-between pt-4 px-4">
				<button
					class="flex justify-center items-center gap-1 w-28 h-12 rounded-lg bg-black text-white text-sm font-medium disabled:opacity-50"
					type="button"
					disabled={currentQuestionId <= 0}
					onClick={() => setCurrentQuestionId(currentQuestionId - 1)}
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
						class="lucide lucide-chevron-left"
					>
						<path d="m15 18-6-6 6-6" />
					</svg>
					<p>Previous</p>
				</button>
				{currentQuestionId !== (data.totalQuestions - 1)
					? (
						<button
							class="flex justify-center items-center gap-1 w-28 h-12 rounded-lg bg-black text-white text-sm font-medium disabled:opacity-50"
							type="button"
							disabled={currentQuestionId >= data.totalQuestions - 1}
							onClick={() => setCurrentQuestionId(currentQuestionId + 1)}
						>
							<p>Next</p>
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
								class="lucide lucide-chevron-right"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						</button>
					)
					: (
						<button
							class="flex justify-center items-center w-28 h-12 rounded-lg bg-red-500 text-white text-sm font-medium disabled:opacity-50"
							type="button"
							disabled={choices.includes(null) || isSubmit}
							onClick={() => turnIn()}
						>
							<p>Turn In</p>
						</button>
					)}
			</div>
		</div>
	);
}
