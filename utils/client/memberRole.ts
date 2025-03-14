import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";
import { hasFlags } from "~/utils/server/flags.ts";

export function memberRole(flags: ClassroomMemberFlags) {
	if (hasFlags(flags, [ClassroomMemberFlags.HomeroomTeacher])) {
		return "Homeroom";
	} else if (hasFlags(flags, [ClassroomMemberFlags.Teacher])) {
		return "Teacher";
	} else if (hasFlags(flags, [ClassroomMemberFlags.Student])) {
		return "Student";
	}
}
