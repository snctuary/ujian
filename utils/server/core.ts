import { createDefine } from "fresh";
import { User } from "~/utils/server/user.ts";
import { ClassroomWithHomeroomTeacher } from "~/utils/server/classrooms.ts";

export interface State {
	classroom?: ClassroomWithHomeroomTeacher;
	title?: string;
	user: User | null;
}

export const define = createDefine<State>();
export const kv = await Deno.openKv();
