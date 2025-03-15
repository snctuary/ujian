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
			questions: template.questions,
		};

		const commit = await kv.set([
			"classrooms",
			classroomId,
			"tests",
			"byId",
			newTest.id,
		], newTest);

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
	questions: TestQuestion[];
}

export interface TestQuestion {
	question: string;
	choices: TestQuestionChoice[];
}
interface TestQuestionChoice {
	correctChoice: boolean;
	value: string;
}
