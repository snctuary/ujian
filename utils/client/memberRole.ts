import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";

export function memberRole(flags: ClassroomMemberFlags) {
	switch (flags) {
		case ClassroomMemberFlags.HomeroomTeacher: {
			return "Homeroom Teacher";
		}
		case ClassroomMemberFlags.Teacher: {
			return "Teacher";
		}
		case ClassroomMemberFlags.Student: {
			return "Student";
		}
		default: {
			return "Unknown";
		}
	}
}
