import { createDefine } from "fresh";
import { User } from "~/utils/server/user.ts";
import {
	Classroom,
	ClassroomMember,
	ClassroomTest,
	ClassroomWithHomeroomTeacher,
} from "~/utils/server/classrooms.ts";
import { Test } from "~/utils/server/tests.ts";

export interface State {
	classroom?: ClassroomWithHomeroomTeacher & { currentMember: ClassroomMember };
	classroomTest?: ClassroomTest & { author: User };
	classrooms: Classroom[];
	currentClassroomId?: string;
	currentClassroomMember?: ClassroomMember;
	currentTest?: Test;
	title?: string;
	user: User | null;
}

export const define = createDefine<State>();
export const kv = await Deno.openKv();
