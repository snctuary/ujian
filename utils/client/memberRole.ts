import { ClassroomMemberFlags } from "~/utils/server/classrooms.ts";
import { hasFlags } from "~/utils/server/flags.ts";

export function memberRole(flags: ClassroomMemberFlags) {
	if (hasFlags(flags, [1 << 1])) {
		return "Homeroom";
	} else if (hasFlags(flags, [1 << 2])) {
		return "Teacher";
	} else if (hasFlags(flags, [1 << 3])) {
		return "Student";
	}
}
