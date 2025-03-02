import { useEffect, useState } from "preact/hooks";
import {
	ClassroomTest,
	ClassroomTestQuiz,
	CreateClassroomTestData,
} from "~/utils/server/classrooms.ts";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	classroomId: string;
}

export function CreateClassroomTest({ classroomId }: Props) {
	const [title, setTitle] = useState<string>("New Test");
	const [questions, setQuestions] = useState<ClassroomTestQuiz[]>([]);
	const [csrf, setCsrf] = useState<string>();

	useEffect(() => handleCsrf(setCsrf), []);

	async function createTest() {
		if (csrf && title) {
			const data: CreateClassroomTestData = {
				title,
				quiz: questions,
			};
			const body = JSON.stringify(data);
			const newTest = await makeRequest<ClassroomTest>(
				`/api/classrooms/${classroomId}/tests`,
				{
					csrfToken: csrf,
					body,
					method: "POST",
				},
			);

			if (newTest) {
				globalThis.location.href =
					`/classrooms/${classroomId}/tests/${newTest.id}`;
			}
		}
	}

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
														correctChoice: choice.correctChoice,
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
				class="flex justify-center items-center gap-2 fill-current text-slate-400 hover:text-slate-500 font-bold py-4 border-2 border-current rounded-xl md:mx-10"
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
			<button
				class="flex justify-center items-center gap-2 fill-current text-white hover:text-black bg-black hover:bg-white font-bold py-4 hover:border-2 border-black rounded-xl md:mx-10"
				onClick={createTest}
				type="button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					data-name="Layer 1"
					viewBox="0 0 24 24"
					width="22"
					height="22"
				>
					<path d="M2.829,17.331c-.771,.312-1.643-.06-1.954-.825-.218-.535-.397-1.093-.534-1.656-.196-.806,.297-1.617,1.102-1.812,.12-.029,.239-.043,.356-.043,.676,0,1.289,.459,1.456,1.145,.104,.423,.237,.839,.399,1.238,.312,.768-.058,1.643-.825,1.954Zm-1.381-6.405c.799,.2,1.616-.292,1.815-1.097,.104-.42,.24-.836,.404-1.238,.313-.767-.055-1.643-.821-1.956-.186-.076-.378-.111-.566-.111-.592,0-1.152,.352-1.39,.933-.219,.536-.4,1.093-.539,1.654-.199,.804,.292,1.617,1.097,1.815ZM6.208,5.111c.333-.28,.689-.538,1.057-.767,.704-.437,.92-1.361,.483-2.065-.284-.458-.774-.709-1.275-.709-.271,0-.544,.072-.79,.226-.489,.304-.963,.647-1.406,1.021-.634,.533-.715,1.479-.182,2.113,.532,.633,1.479,.717,2.113,.182Zm1.03,14.526c-.369-.23-.725-.49-1.057-.771-.281-.238-.626-.354-.968-.354-.427,0-.85,.181-1.146,.531-.535,.633-.456,1.579,.177,2.114,.44,.372,.911,.717,1.4,1.023,.702,.437,1.628,.228,2.068-.475,.439-.702,.227-1.628-.475-2.068Zm16.762-7.638C24,5.715,19.142,.554,12.985,.05c-.034-.005-.688-.05-.985-.05-.287,0-.571,.01-.853,.03-.827,.059-1.449,.776-1.39,1.603s.791,1.447,1.603,1.39c.368-.026,.745-.017,1.116,.002,4.741,.25,8.524,4.174,8.524,8.976,0,4.963-4.038,9-9,9-.217,0-.716-.026-.752-.026-.779,0-1.438,.604-1.494,1.394-.059,.827,.563,1.544,1.39,1.603,.283,.021,.569,.03,.856,.03s.928-.044,.964-.049c6.167-.494,11.036-5.659,11.036-11.951Zm-12,6c.829,0,1.5-.672,1.5-1.5v-4.5h2.623c.788,0,1.185-.95,.632-1.511l-4.202-4.258c-.304-.308-.8-.308-1.104,0l-4.202,4.258c-.553,.561-.156,1.511,.632,1.511h2.623v4.5c0,.828,.671,1.5,1.5,1.5Z" />
				</svg>
				<p>Upload Test</p>
			</button>
		</div>
	);
}
