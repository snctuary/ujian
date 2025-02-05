import { snowflake } from "~/utils/snowflake.ts";
import { kv } from "~/utils/core.ts";
import { retrieveUser, User } from "~/utils/user.ts";

export async function addClassroomMember(classroomId: string, userId: string) {
	const classroom = await retrieveClassroom(classroomId, true);

	const newMember: ClassroomMember = {
		flags: ClassroomMemberFlags.Student,
		userId,
	};
	const joinedClassrooms = await retrieveJoinedClassrooms(userId);

	const memberKey = ["classrooms", classroomId, "members", userId];
	const commit = await kv.atomic().check({
		key: memberKey,
		versionstamp: null,
	}).set(memberKey, newMember).set(["users", "classrooms", userId], [
		...joinedClassrooms,
		classroom.id,
	]).commit();

	if (commit.ok) {
		return newMember;
	} else {
		throw new Error("Failed to add member");
	}
}

export async function createClassroom(name: string, homeroomTeacherId: string) {
	const id = snowflake();
	const newClass: Classroom = {
		id,
		name,
		homeroomTeacherId,
	};

	const userClassroomsKey = ["users", "classrooms", homeroomTeacherId];
	const joinedClassrooms = await kv.get<string>(userClassroomsKey);
	const commit = await kv.atomic().set(["classrooms", newClass.id], newClass)
		.set(userClassroomsKey, [...(joinedClassrooms.value ?? []), newClass.id])
		.commit();

	if (commit.ok) {
		try {
			await addClassroomMember(newClass.id, homeroomTeacherId);
		} catch (_) {
			await deleteClassroom(newClass.id);
		}
	}
}

export async function fetchClassrooms(classroomIds: string[]) {
	const classrooms = await Promise.all(
		classroomIds.map((classroomId) => retrieveClassroom(classroomId, true)),
	);
	const userIds = new Set<string>(
		classrooms.map((classroom) => classroom.homeroomTeacherId),
	);
	const users = new Map<string, User>();

	for (const userId of userIds) {
		const user = await retrieveUser(userId, true);
		users.set(userId, user);
	}

	return classrooms.map((classroom) => ({
		...classroom,
		homeroomTeacher: users.get(classroom.homeroomTeacherId)!,
	}));
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
) {
	const member = await kv.get<ClassroomMember>([
		"classrooms",
		classroomId,
		"members",
		memberId,
	]);
	return member.value;
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

export interface Classroom {
	id: string;
	name: string;
	homeroomTeacherId: string;
}
export interface ClassroomWithHomeroomTeacher extends Classroom {
	homeroomTeacher: User;
}

enum ClassroomMemberFlags {
	None = 0,
	HomeroomTeacher = 1 << 1,
	Teacher = 1 << 2,
	Student = 1 << 3,
}
interface ClassroomMember {
	flags: ClassroomMemberFlags;
	userId: string;
}
