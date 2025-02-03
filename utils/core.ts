import { createDefine } from "fresh";
import { User } from "~/utils/user.ts";

export interface State {
	title?: string;
	user: User | null;
}

export const define = createDefine<State>();
export const kv = await Deno.openKv();
