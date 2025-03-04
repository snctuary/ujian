import { ClassroomTestQuiz } from "~/utils/server/classrooms.ts";
import { useState } from "preact/hooks";

interface Props {
	questions: ClassroomTestQuiz[];
}

export function ClassroomTestForm({ questions }: Props) {
	const [currentQuestion, setCurrentQuestion] = useState<number>(0);
	const [choices, setChoices] = useState<(number | null)[]>(
		questions.map((_) => null),
	);
	const completed = !choices.includes(null);

	return (
		<div class="flex flex-col justify-center items-center min-h-full overflow-y-auto no-scrollbar p-4">
			<div class="flex flex-col size-full max-w-96 gap-1 no-scrollbar">
				<p class="text-slate-400 text-sm font-semibold">
					Question #{currentQuestion + 1}
				</p>
				<p class="font-semibold text-lg">
					{questions[currentQuestion].question}
				</p>
				{questions[currentQuestion].choices.map((choice, choiceId) => (
					<button
						data-selected={choices[currentQuestion] === choiceId}
						class="flex bg-black rounded-lg p-3 text-white data-[selected=true]:bg-white data-[selected=true]:text-black data-[selected=true]: border-4 border-black font-semibold"
						onClick={() => setChoices(choices.with(currentQuestion, choiceId))}
						type="button"
					>
						<p>{choice.value}</p>
					</button>
				))}
				<div class="flex justify-between mt-3">
					<div class="flex gap-2">
						<button
							class="flex justify-center items-center bg-black text-white font-bold text-sm rounded-lg px-4 py-2 disabled:opacity-25"
							onClick={() => setCurrentQuestion(currentQuestion - 1)}
							disabled={currentQuestion <= 0}
							type="button"
						>
							Previous
						</button>
						<button
							class="flex justify-center items-center bg-black text-white font-bold text-sm rounded-lg px-4 py-2 disabled:opacity-25"
							onClick={() => setCurrentQuestion(currentQuestion + 1)}
							disabled={currentQuestion >= questions.length - 1}
							type="button"
						>
							Next
						</button>
					</div>
					<button
						class="fill-red-500 disabled:opacity-25"
						disabled={!completed}
						type="button"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							id="Layer_1"
							data-name="Layer 1"
							viewBox="0 0 24 24"
							width="24"
							height="24"
						>
							<path d="m12,7V.46c.913.346,1.753.879,2.465,1.59l3.484,3.486c.712.711,1.245,1.551,1.591,2.464h-6.54c-.552,0-1-.449-1-1Zm1.27,12.48c-.813.813-1.27,1.915-1.27,3.065v1.455h1.455c1.15,0,2.252-.457,3.065-1.27l6.807-6.807c.897-.897.897-2.353,0-3.25-.897-.897-2.353-.897-3.25,0l-6.807,6.807Zm-3.27,3.065c0-1.692.659-3.283,1.855-4.479l6.807-6.807c.389-.389.842-.688,1.331-.901-.004-.12-.009-.239-.017-.359h-6.976c-1.654,0-3-1.346-3-3V.024c-.161-.011-.322-.024-.485-.024h-4.515C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h5v-1.455Z" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
