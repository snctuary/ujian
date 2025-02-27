import { useState } from "preact/hooks";
import { ClassroomTestQuiz } from "~/utils/server/classrooms.ts";

interface Props {
	classroomId: string;
}

export function CreateClassroomTest({}: Props) {
	const [title, setTitle] = useState<string>("New Test");
	const [questions, setQuestions] = useState<ClassroomTestQuiz[]>([]);

	function addQuestion() {
		setQuestions([...questions, {
			question: "",
			correctChoiceId: 0,
			choices: ["first", "second", "thirrddddddddddddddddd"],
		}]);
	}

	return (
		<div class="flex flex-col px-4 gap-3 no-scrollbar">
			<input
				class="flex bg-slate-100 px-4 py-3 rounded-lg outline-none text-lg placeholder:text-slate-400 font-semibold"
				placeholder="New Test"
				onInput={(input) => setTitle(input.currentTarget.value)}
				value={title}
			/>
			{questions.map((question, questionId) => (
				<div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-2 border border-slate-200 hover:border-slate-500 transition-all ease-in-out duration-150">
					<input
						class="flex bg-transparent p-2 placeholder:text-slate-400 text-lg outline-none"
						placeholder={`Question #${questionId + 1}`}
						value={question.question}
						onInput={(input) =>
							setQuestions(
								questions.with(questionId, {
									...question,
									question: input.currentTarget.value,
								}),
							)}
					/>
					{question.choices.map((choice, choiceId) => (
						<div
							class="flex gap-2 p-2 rounded-lg border-2 border-dashed data-[correct=true]:border-solid border-red-400 data-[correct=true]:border-green-400"
							data-correct={choiceId === question.correctChoiceId}
						>
							<p>{choice}</p>
						</div>
					))}
				</div>
			))}
			<button
				class="flex justify-center p-3 border-2 bg-slate-50 hover:bg-slate-100 border-current border-dashed text-slate-500 font-semibold rounded-lg transition-all ease-in-out duration-150"
				onClick={() => addQuestion()}
				type="button"
			>
				<p>Add Question</p>
			</button>
		</div>
	);
}
