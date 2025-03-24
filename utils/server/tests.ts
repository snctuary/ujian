import { snowflake } from "~/utils/server/snowflake.ts";
import { kv } from "~/utils/server/core.ts";
import { shuffle } from "@std/random/shuffle";

export async function createDraft(
	classroomId: string,
	authorId: string,
	name: string,
	questions: TestQuestion[],
) {
	const newDraft: TestDraft = {
		id: snowflake(),
		name,
		authorId,
		lastEditedAt: new Date().toISOString(),
		questions,
	};

	const commit = await kv.set([
		"classrooms",
		classroomId,
		"drafts",
		authorId,
		newDraft.id,
	], newDraft);
	if (commit.ok) {
		return newDraft;
	} else {
		throw new Error("Failed to create draft");
	}
}

export interface CreateTestOptions extends Pick<Test, "name"> {
	duration: number;
	templateId: string;
}
export async function createTest(
	classroomId: string,
	authorId: string,
	{ name, duration, templateId }: CreateTestOptions,
) {
	const template = await fetchDraft(classroomId, authorId, templateId);

	if (!template) {
		throw new Error("Unknown Template");
	} else {
		if (!template.questions.length) {
			throw new Error("This test has no questions, need at least 1");
		} else {
			const newTest: Test = {
				id: snowflake(),
				name,
				endsAt: new Date(Math.floor(Date.now()) + (duration * 60 * 1_000))
					.toISOString(),
				authorId,
				totalQuestions: template.questions.length,
			};

			const testKey = ["classrooms", classroomId, "tests", "byId", newTest.id];

			const commit = await kv.atomic().set([...testKey, "info"], newTest).set([
				...testKey,
				"data",
			], template.questions).commit();

			if (commit.ok) {
				return newTest;
			} else {
				throw new Error("Failed to create test");
			}
		}
	}
}

export async function createTestAnswer(
	classroomId: string,
	testId: string,
	studentId: string,
	answers: number[],
) {
	const questions = await fetchTestQuestions(classroomId, testId);
	const randomized = await fetchRandomizedOrder(classroomId, testId, studentId);

	if (!questions || !randomized) {
		throw new Error("Can't find original or randomized questions");
	} else {
		const correctChoiceIds = questions.map((question) => {
			const correctChoice = question.choices.find((choice) =>
				choice.correctChoice
			)!;
			return question.choices.indexOf(correctChoice);
		});

		const results = correctChoiceIds.map((correctChoiceId, questionId) => {
			const partialQuestion = randomized.find((q) =>
				q.questionId === questionId
			)!;
			const selected = partialQuestion.choices.at(
				answers.at(randomized.indexOf(partialQuestion))!,
			);
			return selected === correctChoiceId;
		});

		const testResult: TestResult = {
			userId: studentId,
			results,
			score: (100 / questions.length) *
				results.filter((result) => result === true).length,
		};

		const testResultKey = [
			"classrooms",
			classroomId,
			"tests",
			"byId",
			testId,
			"results",
			studentId,
		];
		const commit = await kv.atomic().set([...testResultKey, "data"], testResult)
			.set([...testResultKey, "score"], testResult.score).delete([
				"classrooms",
				classroomId,
				"tests",
				testId,
				"randomized",
				studentId,
			]).commit();

		if (!commit.ok) {
			throw new Error("Failed to save test result");
		}
	}
}

export async function deleteTest(classroomId: string, testId: string) {
	const atomic = kv.atomic();

	for await (
		const { key } of kv.list({
			prefix: ["classrooms", classroomId, "tests", "byId", testId],
		})
	) {
		atomic.delete(key);
	}

	const commit = await atomic.commit();

	if (!commit.ok) {
		throw new Error("Failed to delete test");
	}
}

export async function editDraft(
	classroomId: string,
	authorId: string,
	draftId: string,
	data: Partial<Omit<TestDraft, "id">>,
) {
	const draft = await fetchDraft(classroomId, authorId, draftId);

	if (!draft) {
		throw new Error("Unknown Draft");
	} else {
		const updatedData: TestDraft = {
			...draft,
			...data,
			id: draft.id,
			authorId: authorId,
			lastEditedAt: new Date().toISOString(),
		};

		const commit = await kv.set([
			"classrooms",
			classroomId,
			"drafts",
			authorId,
			draftId,
		], updatedData);

		if (commit.ok) {
			return updatedData;
		} else {
			throw new Error("Failed to update data");
		}
	}
}

export async function fetchStatus(
	classroomId: string,
	test: Test,
	studentId: string,
) {
	const completed = await fetchTestAnswer(classroomId, test.id, studentId);

	if (Date.parse(test.endsAt) > Date.now()) {
		return completed ? TestStatusCode.Completed : TestStatusCode.Ongoing;
	} else {
		return completed ? TestStatusCode.Completed : TestStatusCode.Ended;
	}
}

export async function fetchTest(classroomId: string, testId: string) {
	const test = await kv.get<Test>([
		"classrooms",
		classroomId,
		"tests",
		"byId",
		testId,
		"info",
	]);
	return test.value;
}

export async function fetchTestAnswer(
	classroomId: string,
	testId: string,
	studentId: string,
) {
	const testResult = await kv.get<TestResult>([
		"classrooms",
		classroomId,
		"tests",
		"byId",
		testId,
		"results",
		studentId,
		"data",
	]);

	return testResult.value;
}

export async function fetchTestQuestions(classroomId: string, testId: string) {
	const questions = await kv.get<TestQuestion[]>([
		"classrooms",
		classroomId,
		"tests",
		"byId",
		testId,
		"data",
	]);
	return questions.value;
}

export async function fetchTests(classroomId: string) {
	const tests = await Array.fromAsync(
		kv.list<Test>({ prefix: ["classrooms", classroomId, "tests", "byId"] }, {
			reverse: true,
		}),
	);
	return tests.filter((ctx) => ctx.key.at(-1) === "info").map((test) =>
		test.value
	);
}

export async function fetchTestResults(classroomId: string, testId: string) {
	const tests = await Array.fromAsync(
		kv.list<TestResult>({
			prefix: ["classrooms", classroomId, "tests", "byId", testId, "results"],
		}),
	);
	return tests.filter((ctx) => ctx.key.at(-1) === "data").map((test) =>
		test.value
	);
}

export async function fetchDraft(
	classroomId: string,
	authorId: string,
	draftId: string,
) {
	const draft = await kv.get<TestDraft>([
		"classrooms",
		classroomId,
		"drafts",
		authorId,
		draftId,
	]);
	return draft.value;
}

export async function fetchDrafts(
	classroomId: string,
	authorId: string,
	limit?: number,
	cursor?: string,
) {
	const fetchedDrafts = await kv.list<TestDraft>({
		prefix: ["classrooms", classroomId, "drafts", authorId],
	}, { cursor, limit });
	const data = await Array.fromAsync(fetchedDrafts);

	return { cursor: fetchedDrafts.cursor, data: data.map((ctx) => ctx.value) };
}

export async function fetchRandomizedOrder(
	classroomId: string,
	testId: string,
	studentId: string,
) {
	const data = await kv.get<TestRandomizedQuestion[]>([
		"classrooms",
		classroomId,
		"tests",
		testId,
		"randomized",
		studentId,
	]);
	return data.value;
}

export async function randomizeOrder(
	classroomId: string,
	testId: string,
	studentId: string,
) {
	const existedData = await fetchRandomizedOrder(
		classroomId,
		testId,
		studentId,
	);
	const questions = await fetchTestQuestions(classroomId, testId);

	if (existedData) {
		return existedData.map((partialQuestion) => {
			const question = questions!.at(partialQuestion.questionId)!;

			return {
				question: question.question,
				choices: partialQuestion.choices.map((choiceId) =>
					question.choices.at(choiceId)!.value
				),
			};
		});
	} else {
		if (!questions) {
			throw new Error("Can't find questions data for this test");
		} else {
			const data: TestRandomizedQuestion[] = shuffle(
				questions.map((question, questionId) => ({
					questionId,
					choices: shuffle(question.choices.map((_, choiceId) => choiceId)),
				})),
			);

			const commit = await kv.set([
				"classrooms",
				classroomId,
				"tests",
				testId,
				"randomized",
				studentId,
			], data);

			if (commit.ok) {
				return data.map((partialQuestion) => {
					const question = questions!.at(partialQuestion.questionId)!;

					return {
						question: question.question,
						choices: partialQuestion.choices.map((choiceId) =>
							question.choices.at(choiceId)!.value
						),
					};
				});
			} else {
				throw new Error("Failed to randomize questions");
			}
		}
	}
}

export interface TestDraft {
	id: string;
	name: string;
	authorId: string;
	lastEditedAt: string;
	questions: TestQuestion[];
}

export interface Test {
	id: string;
	name: string;
	authorId: string;
	endsAt: string;
	totalQuestions: number;
}

export interface TestResult {
	userId: string;
	results: boolean[];
	score: number;
}

export interface PartialTestQuestion extends Omit<TestQuestion, "choices"> {
	choices: string[];
}

export interface TestRandomizedQuestion {
	questionId: number;
	choices: number[];
}

export enum TestStatusCode {
	Upcoming,
	Ongoing,
	Ended,
	Completed,
}

export interface TestQuestion {
	question: string;
	choices: TestQuestionChoice[];
}
interface TestQuestionChoice {
	correctChoice: boolean;
	value: string;
}
