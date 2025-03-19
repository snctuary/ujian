import { PartialTestQuestion, Test } from "~/utils/server/tests.ts";
import { useState } from "preact/hooks";

interface Props {
	data: Test & { questions: PartialTestQuestion[] };
}

export function TestView({ data }: Props) {
	const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
	const [choices, setChoices] = useState<(number | null)[]>(
		data.questions.map(() => null),
	);
	const currentQuestion = data.questions.at(currentQuestionId)!;

	return (
		<div class="flex flex-col h-full gap-3 py-4">
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-center px-4">
					<p class="font-semibold text-xl">{data.name}</p>
				</div>
				<div class="flex gap-2 px-4 py-2 overflow-x-auto">
					{data.questions.map((_, questionIndex) => (
						<button
							type="button"
							onClick={() => setCurrentQuestionId(questionIndex)}
						>
							<div
								data-current={currentQuestionId === questionIndex}
								class="flex justify-center items-center size-10 rounded-full font-semibold text-slate-500 data-[current=true]:text-white bg-slate-100 data-[current=true]:bg-black"
							>
								<p>{questionIndex + 1}</p>
							</div>
						</button>
					))}
				</div>
			</div>
			<div class="flex flex-col grow gap-2 p-4 overflow-y-auto relative">
				<p class="text-2xl font-semibold mb-6">{currentQuestion.question}</p>
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
			</div>
		</div>
	);
}
