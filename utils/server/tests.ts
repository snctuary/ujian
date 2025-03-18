import { snowflake } from "~/utils/server/snowflake.ts";
import { kv } from "~/utils/server/core.ts";

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

interface CreateTestOptions extends Pick<Test, "name"> {
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
	const completed = !(await kv.atomic().check({
		key: [
			"classrooms",
			classroomId,
			"tests",
			test.id,
			"responses",
			studentId,
		],
		versionstamp: null,
	}).commit());

	if (Date.parse(test.endsAt) > Date.now()) {
		return completed ? TestStatusCode.Completed : TestStatusCode.Ongoing;
	} else {
		return TestStatusCode.Ended;
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
