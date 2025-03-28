import { snowflake } from "~/utils/server/snowflake.ts";
import { kv } from "~/utils/server/core.ts";
import { retrieveUser, User } from "~/utils/server/user.ts";
import { hasFlags } from "~/utils/server/flags.ts";
import { shuffle } from "@std/random/shuffle";
import { nanoid } from "nanoid";
import { cleanContent } from "~/utils/server/cleanContent.ts";

export async function addClassroomMember(
	classroomId: string,
	user: User,
	flags?: ClassroomMemberFlags,
) {
	const classroom = await retrieveClassroom(classroomId, true);

	const newMember: ClassroomMember = {
		flags: flags ?? ClassroomMemberFlags.Student,
		userId: user.id,
	};
	const joinedClassrooms = await retrieveJoinedClassrooms(user.id);

	const membersKey = ["classrooms", classroomId, "members"];
	const membersWithSameName = await searchMembers(classroomId, user.username);
	const commit = await kv.atomic().check({
		key: [...membersKey, "byId", user.id],
		versionstamp: null,
	}).set([...membersKey, "byId", user.id], newMember).set([
		...membersKey,
		"byName",
		user.username,
	], [...membersWithSameName, user.id]).set(["users", "classrooms", user.id], [
		...joinedClassrooms,
		classroom.id,
	]).commit();

	if (commit.ok) {
		return newMember;
	} else {
		throw new Error("Failed to add member");
	}
}

export async function createClassroom(
	name: string,
	homeroomTeacher: User,
	description?: string,
) {
	const id = snowflake();
	const newClass: Classroom = {
		id,
		name: cleanContent(name),
		description: cleanContent(description ?? ""),
		homeroomTeacherId: homeroomTeacher.id,
	};

	const commit = await kv.atomic().set(["classrooms", newClass.id], newClass)
		.commit();

	if (commit.ok) {
		try {
			await addClassroomMember(
				newClass.id,
				homeroomTeacher,
				ClassroomMemberFlags.HomeroomTeacher | ClassroomMemberFlags.Teacher,
			);
			return newClass;
		} catch (_) {
			await deleteClassroom(newClass.id);
		}
	}
}

export async function createClassroomInvite(classroomId: string) {
	const inviteCode = nanoid(12);
	const inviteKey = ["invites", inviteCode];

	const commit = await kv.atomic().check({ key: inviteKey, versionstamp: null })
		.set(inviteKey, classroomId).set(
			["classrooms", classroomId, "invite"],
			inviteCode,
		).commit();

	if (commit.ok) {
		return inviteCode;
	} else {
		throw new Error("Failed to create invite");
	}
}

export async function createClassroomTest(
	classroomId: string,
	author: ClassroomMember,
	test: CreateClassroomTestData,
) {
	const id = snowflake();
	const newClassroomTest: ClassroomTest = {
		id,
		title: cleanContent(test.title),
		quiz: test.quiz.map((quiz) => ({
			question: cleanContent(quiz.question),
			choices: quiz.choices.map((choice) => ({
				...choice,
				value: cleanContent(choice.value),
			})),
		})),
		authorId: author.userId,
	};

	if (!author) {
		throw new Error("Unknown Class");
	} else {
		if (
			!hasFlags(author.flags, [ClassroomMemberFlags.Teacher]) &&
			!hasFlags(author.flags, [ClassroomMemberFlags.HomeroomTeacher])
		) {
			throw new Error("You're not a teacher");
		} else {
			const commit = await kv.set([
				"classrooms",
				classroomId,
				"tests",
				newClassroomTest.id,
				"data",
			], newClassroomTest);

			if (commit.ok) {
				return newClassroomTest;
			} else {
				throw new Error("Failed to create new test");
			}
		}
	}
}

export async function createClassroomTestResponse(
	classroomId: string,
	testId: string,
	studentId: string,
	responses: ClassroomTestResponses,
) {
	const submittedResponses = await retrieveClassroomTestResponse(
		classroomId,
		testId,
		studentId,
	);

	if (submittedResponses) {
		throw new Error("This student already submitted a response");
	} else {
		const commit = await kv.set([
			"classrooms",
			classroomId,
			"tests",
			testId,
			"responses",
			studentId,
		], responses);

		if (!commit.ok) {
			throw new Error("Failed to proceed");
		}
	}
}

export async function editClassroom(
	classroomId: string,
	data: Partial<Classroom>,
) {
	const classroom = await retrieveClassroom(classroomId, true);
	const newData: Classroom = {
		...classroom,
		name: cleanContent(data.name ?? classroom.name),
	};

	const commit = await kv.set(["classrooms", classroomId], newData);

	if (commit.ok) {
		return newData;
	} else {
		throw new Error("Failed to edit classroom");
	}
}

export async function isAlreadySubmitTestResponses(
	classroomId: string,
	testId: string,
	studentId: string,
): Promise<boolean> {
	const result = await kv.atomic().check({
		key: [
			"classrooms",
			classroomId,
			"tests",
			testId,
			"responses",
			studentId,
		],
		versionstamp: null,
	}).commit();

	return !result.ok;
}

export async function randomizeClassroomTestQuestions(
	classroomId: string,
	testId: string,
	studentId: string,
) {
	const test = await retrieveClassroomTest(classroomId, testId);

	if (!test) {
		throw new Error("Unknown Test");
	} else {
		const randomizedKey = [
			"classrooms",
			classroomId,
			"tests",
			testId,
			"randomized",
			studentId,
		];
		const randomized = await kv.get<ClassroomTestQuestionOrder[]>(
			randomizedKey,
		);

		if (randomized.value) {
			return randomized.value;
		} else {
			const randomized: ClassroomTestQuestionOrder[] = shuffle(test.quiz).map((
				question,
				questionOrder,
			) => ({
				questionId: test.quiz.indexOf(question),
				order: questionOrder,
				choices: shuffle(question.choices).map((choice, choiceOrder) => ({
					choiceId: question.choices.indexOf(choice),
					order: choiceOrder,
				})),
			}));
			const commit = await kv.set(randomizedKey, randomized);

			if (commit.ok) {
				return randomized;
			} else {
				throw new Error("Failed to randomize questions.");
			}
		}
	}
}

export async function fetchClassrooms(classroomIds: string[]) {
	const classrooms = await Promise.all(
		classroomIds.map((classroomId) => retrieveClassroom(classroomId)),
	);
	const availableClassrooms = classrooms.filter((classroom) =>
		classroom !== null
	);
	const userIds = new Set<string>(
		availableClassrooms.map((classroom) => classroom.homeroomTeacherId),
	);
	const users = new Map<string, User>();

	for (const userId of userIds) {
		const user = await retrieveUser(userId, true);
		users.set(userId, user);
	}

	return availableClassrooms.map((classroom) => ({
		...classroom,
		homeroomTeacher: users.get(classroom.homeroomTeacherId)!,
	}));
}

export async function fetchClassroomInvite(classroomId: string) {
	const invite = await kv.get<string>(["classrooms", classroomId, "invite"]);
	return invite.value;
}

export async function fetchClassroomTest(classroomId: string) {
	const data = await Array.fromAsync(
		kv.list<ClassroomTest>({ prefix: ["classrooms", classroomId, "tests"] }),
	);
	return data.filter((test) => test.key.at(-1) === "data").map((test) =>
		test.value
	);
}

export async function findClassroomByInvite(inviteCode: string) {
	const classroomId = await kv.get<string>(["invites", inviteCode]);
	return classroomId.value;
}

export async function removeClassroomMember(
	classroomId: string,
	member: ClassroomMember,
) {
	if (hasFlags(member.flags, [ClassroomMemberFlags.HomeroomTeacher])) {
		throw new Error("You can't leave your own classroom");
	} else {
		const joinedClassrooms = await retrieveJoinedClassrooms(member.userId);
		const user = await retrieveUser(member.userId, true);
		const membersWithSameUsername = await searchMembers(
			classroomId,
			user.username,
		);

		const membersKey = ["classrooms", classroomId, "members"];
		const commit = await kv.atomic().delete([
			...membersKey,
			"byId",
			member.userId,
		]).set(
			[...membersKey, "byName", user.username],
			membersWithSameUsername.filter((id) => id !== member.userId),
		).set(
			["users", "classrooms", member.userId],
			joinedClassrooms.filter((id) => id !== classroomId),
		).commit();

		if (!commit.ok) {
			throw new Error("Failed to remove member");
		}
	}
}

export async function deleteClassroom(classroomId: string) {
	const classroom = await retrieveClassroom(classroomId, true);

	const classroomKey = ["classrooms", classroom.id];
	const atomic = kv.atomic().delete(classroomKey);

	for await (const data of kv.list({ prefix: classroomKey })) {
		[
			atomic.delete(data.key),
		];
	}

	await atomic.commit();
}

export async function retrieveClassroom(
	classroomId: string,
	required: true,
): Promise<Classroom>;
export async function retrieveClassroom(
	classroomId: string,
	required?: false,
): Promise<Classroom | null>;
export async function retrieveClassroom(
	classroomId: string,
	required?: boolean,
) {
	const classroom = await kv.get<Classroom>(["classrooms", classroomId]);

	if (required && !classroom.value) {
		throw new Error("Unknown Classroom");
	}

	return classroom.value;
}

export async function retrieveClassroomMember(
	classroomId: string,
	memberId: string,
	required: true,
): Promise<ClassroomMember>;
export async function retrieveClassroomMember(
	classroomId: string,
	memberId: string,
	required?: false,
): Promise<ClassroomMember | null>;
export async function retrieveClassroomMember(
	classroomId: string,
	memberId: string,
	required?: boolean,
) {
	const member = await kv.get<ClassroomMember>([
		"classrooms",
		classroomId,
		"members",
		"byId",
		memberId,
	]);

	if (required && !member.value) {
		throw new Error("Unknown Member");
	}

	return member.value;
}

export async function retrieveClassroomMembers(
	classroomId: string,
	fullData: true,
): Promise<(ClassroomMember & { user: User })[]>;
export async function retrieveClassroomMembers(
	classroomId: string,
	fullData?: false,
): Promise<ClassroomMember[]>;
export async function retrieveClassroomMembers(
	classroomId: string,
	fullData?: boolean,
) {
	const members = await Array.fromAsync(
		kv.list<ClassroomMember>({
			prefix: ["classrooms", classroomId, "members", "byId"],
		}),
	);

	if (fullData) {
		const fetchedUsers = await Promise.all(
			members.map((member) => retrieveUser(member.value.userId, true)),
		);
		return members.map((member, index) => ({
			...member.value,
			user: fetchedUsers.at(index)!,
		}));
	} else {
		return members.map((member) => member.value);
	}
}

export async function retrieveClassroomTest(
	classroomId: string,
	testId: string,
) {
	const test = await kv.get<ClassroomTest>([
		"classrooms",
		classroomId,
		"tests",
		testId,
		"data",
	]);
	return test.value;
}

export async function retrieveClassroomTestResponse(
	classroomId: string,
	testId: string,
	studentId: string,
) {
	const response = await kv.get<ClassroomTestResponses>([
		"classrooms",
		classroomId,
		"tests",
		testId,
		"responses",
		studentId,
	]);
	return response.value;
}

export async function retrieveJoinedClassrooms(
	userId: string,
	fullData: true,
): Promise<ClassroomWithHomeroomTeacher[]>;
export async function retrieveJoinedClassrooms(
	userId: string,
	fullData?: false,
): Promise<string[]>;
export async function retrieveJoinedClassrooms(
	userId: string,
	fullData?: boolean,
) {
	const fetchedClassrooms = await kv.get<string[]>([
		"users",
		"classrooms",
		userId,
	]);
	const classrooms = fetchedClassrooms.value ?? [];

	if (fullData) {
		return await fetchClassrooms(classrooms);
	} else {
		return classrooms;
	}
}

export async function searchMembers(
	classroomId: string,
	name: string,
	fullData: true,
): Promise<(ClassroomMember & { user: User })[]>;
export async function searchMembers(
	classroomId: string,
	name: string,
	fullData?: false,
): Promise<string[]>;
export async function searchMembers(
	classroomId: string,
	name: string,
	fullData?: boolean,
) {
	const memberIds = [];
	for await (
		const fetchedIds of kv.list<string[]>({
			prefix: ["classrooms", classroomId, "members", "byName"],
			start: ["classrooms", classroomId, "members", "byName", name],
		})
	) {
		if (
			fetchedIds.key.at(-1)?.toString().toLowerCase().startsWith(
				name.toLowerCase(),
			)
		) {
			memberIds.push(...fetchedIds.value);
		}
	}

	if (fullData) {
		const members = await Promise.all(
			memberIds.map((memberId) =>
				retrieveClassroomMember(classroomId, memberId, true)
			),
		);
		const fetchedUsers = await Promise.all(
			members.map((member) => retrieveUser(member.userId, true)),
		);
		return members.map((member, index) => ({
			...member,
			user: fetchedUsers.at(index)!,
		}));
	} else {
		return memberIds;
	}
}

export interface Classroom {
	id: string;
	name: string;
	description?: string;
	homeroomTeacherId: string;
	memberCount?: number;
}
export interface ClassroomWithHomeroomTeacher extends Classroom {
	homeroomTeacher: User;
}

export interface ClassroomInvite {
	inviteCode: string;
}

export enum ClassroomMemberFlags {
	None = 0,
	HomeroomTeacher = 1 << 1,
	Teacher = 1 << 2,
	Student = 1 << 3,
}
export interface ClassroomMember {
	flags: ClassroomMemberFlags;
	userId: string;
}

export interface ClassroomTest {
	id: string;
	title: string;
	description?: string;
	authorId: string;
	endAt?: number;
	quiz: ClassroomTestQuiz[];
}

export interface ClassroomTestQuiz {
	question: string;
	choices: ClassroomTestQuizChoice[];
}

export interface ClassroomTestQuizChoice {
	correctChoice: boolean;
	value: string;
}

export interface ClassroomTestQuestionOrder {
	questionId: number;
	order: number;
	choices: ClassroomTestChoiceOrder[];
}
export interface ClassroomTestChoiceOrder {
	choiceId: number;
	order: number;
}

export type CreateClassroomTestData = Omit<ClassroomTest, "id" | "authorId">;
export type ClassroomTestRandomizedOrder = ClassroomTestQuestionOrder[];
export type ClassroomTestResponses = number[];
