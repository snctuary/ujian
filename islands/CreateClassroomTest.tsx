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
			question: "Ask a question..",
			choices: [
				{ correctChoice: true, value: "first choice" },
				{ correctChoice: false, value: "second choice" },
				{ correctChoice: false, value: "third choice" },
			],
		}]);
	}

	return (
		<div class="flex flex-col px-4 gap-3 no-scrollbar">
			<div class="flex flex-col text-lg">
				<p class="font-semibold">Test Title</p>
				<input
					class="flex bg-transparent placeholder:text-slate-400 font-bold pb-1 border-b border-b-slate-200 hover:border-b-slate-400 outline-none transition-all ease-in-out duration-150"
					type="text"
					onInput={(input) => setTitle(input.currentTarget.value)}
					value={title}
					placeholder="sigma skibidi"
				/>
			</div>
			<p class="font-bold mb-1">Questions</p>
			{questions.map((question, questionId) => (
				<div class="flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 md:mx-10">
					<div class="flex justify-between items-center">
						<p class="text-slate-500 font-semibold text-sm px-4 py-2">
							Question {questionId + 1}
						</p>
						<div class="flex pr-4">
							<button
								class="fill-slate-400 hover:fill-red-500 rounded-lg p-2 hover:bg-red-100"
								onClick={() =>
									setQuestions(
										questions.filter((_question, currentQuestionId) =>
											questionId !== currentQuestionId
										),
									)}
								type="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									version="1.1"
									id="Capa_1"
									x="0px"
									y="0px"
									viewBox="0 0 512 512"
									style="enable-background:new 0 0 512 512;"
									xml:space="preserve"
									width="14"
									height="14"
								>
									<g>
										<path d="M490.667,96c0-17.673-14.327-32-32-32h-80.555C364.632,25.757,328.549,0.13,288,0h-64   c-40.549,0.13-76.632,25.757-90.112,64H53.333c-17.673,0-32,14.327-32,32l0,0c0,17.673,14.327,32,32,32H64v266.667   C64,459.468,116.532,512,181.333,512h149.333C395.468,512,448,459.468,448,394.667V128h10.667   C476.34,128,490.667,113.673,490.667,96z M384,394.667C384,424.122,360.122,448,330.667,448H181.333   C151.878,448,128,424.122,128,394.667V128h256V394.667z" />
										<path d="M202.667,384c17.673,0,32-14.327,32-32V224c0-17.673-14.327-32-32-32s-32,14.327-32,32v128   C170.667,369.673,184.994,384,202.667,384z" />
										<path d="M309.333,384c17.673,0,32-14.327,32-32V224c0-17.673-14.327-32-32-32s-32,14.327-32,32v128   C277.333,369.673,291.66,384,309.333,384z" />
									</g>
								</svg>
							</button>
						</div>
					</div>
					<div class="flex flex-col gap-1 bg-white p-4 font-semibold text-sm text-slate-500 rounded-3xl">
						<p>Question</p>
						<textarea
							class="flex outline-none rounded-2xl p-2 border border-gray-200 hover:border-gray-400 text-black resize-none no-scrollbar"
							onInput={(input) =>
								setQuestions(
									questions.with(questionId, {
										...question,
										question: input.currentTarget.value,
									}),
								)}
							value={question.question}
						/>
						<p class="mt-4">Choices</p>
						{question.choices.map((choice, choiceId) => (
							<div class="flex items-center gap-2">
								<input
									class="grow outline-none rounded-2xl p-2 border border-gray-200 hover:border-gray-400 text-black resize-none no-scrollbar"
									onInput={(input) =>
										setQuestions(
											questions.with(questionId, {
												...question,
												choices: question.choices.with(
													choiceId,
													{
														correctChoice: false,
														value: input.currentTarget.value,
													},
												),
											}),
										)}
									value={choice.value}
								/>
								<button
									data-correct={question.choices.indexOf(
										question.choices.find((c) => c.correctChoice)!,
									) === choiceId}
									class="flex justify-center items-center bg-slate-100 data-[correct=true]:bg-black rounded-full size-6 group"
									onClick={() =>
										setQuestions(
											questions.with(questionId, {
												...question,
												choices: question.choices.map((c, currentChoiceId) => ({
													...c,
													correctChoice: currentChoiceId === choiceId,
												})),
											}),
										)}
									type="submit"
								>
									<div class="group-data-[correct=true]:bg-white rounded-full size-3">
									</div>
								</button>
								<button
									class="fill-slate-400 hover:fill-red-500 disabled:opacity-50 disabled:hover:fill-slate-400"
									disabled={question.choices.length <= 2 ||
										question.choices.indexOf(
												question.choices.find((c) => c.correctChoice)!,
											) === choiceId}
									onClick={() =>
										setQuestions(
											questions.with(questionId, {
												...question,
												choices: question.choices.filter((
													_choice,
													currentChoiceId,
												) => currentChoiceId !== choiceId),
											}),
										)}
									type="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										version="1.1"
										id="Capa_1"
										x="0px"
										y="0px"
										viewBox="0 0 512 512"
										style="enable-background:new 0 0 512 512;"
										xml:space="preserve"
										width="18"
										height="18"
									>
										<g>
											<path d="M490.667,96c0-17.673-14.327-32-32-32h-80.555C364.632,25.757,328.549,0.13,288,0h-64   c-40.549,0.13-76.632,25.757-90.112,64H53.333c-17.673,0-32,14.327-32,32l0,0c0,17.673,14.327,32,32,32H64v266.667   C64,459.468,116.532,512,181.333,512h149.333C395.468,512,448,459.468,448,394.667V128h10.667   C476.34,128,490.667,113.673,490.667,96z M384,394.667C384,424.122,360.122,448,330.667,448H181.333   C151.878,448,128,424.122,128,394.667V128h256V394.667z" />
											<path d="M202.667,384c17.673,0,32-14.327,32-32V224c0-17.673-14.327-32-32-32s-32,14.327-32,32v128   C170.667,369.673,184.994,384,202.667,384z" />
											<path d="M309.333,384c17.673,0,32-14.327,32-32V224c0-17.673-14.327-32-32-32s-32,14.327-32,32v128   C277.333,369.673,291.66,384,309.333,384z" />
										</g>
									</svg>
								</button>
							</div>
						))}
						<div class="mt-4">
							<button
								class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 fill-current text-slate-500 p-3 rounded-xl"
								onClick={() =>
									setQuestions(
										questions.with(questionId, {
											...question,
											choices: [...question.choices, {
												correctChoice: false,
												value: "new choice",
											}],
										}),
									)}
								type="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									version="1.1"
									id="Capa_1"
									x="0px"
									y="0px"
									viewBox="0 0 512 512"
									style="enable-background:new 0 0 512 512;"
									xml:space="preserve"
									width="18"
									height="18"
								>
									<g>
										<path d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
									</g>
								</svg>
								<p>Add Choice</p>
							</button>
						</div>
					</div>
				</div>
			))}
			<button
				class="flex justify-center items-center gap-2 fill-current text-slate-400 hover:text-slate-500 font-bold py-4 border-2 border-current rounded-xl mx-10"
				onClick={addQuestion}
				type="button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					id="Capa_1"
					x="0px"
					y="0px"
					viewBox="0 0 512 512"
					style="enable-background:new 0 0 512 512;"
					xml:space="preserve"
					width="22"
					height="22"
				>
					<g>
						<path d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
					</g>
				</svg>
				<p>Add Question</p>
			</button>
		</div>
	);
}
