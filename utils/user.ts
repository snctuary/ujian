import { kv } from "~/utils/core.ts";
import { snowflake } from "~/utils/snowflake.ts";
import { hash } from "@felix/bcrypt";

interface CreateUserOptions extends Omit<User, "avatar"> {
	avatar?: Blob;
	password: string;
}
export async function createUser(
	{ avatar, password, username }: CreateUserOptions,
) {
	const id = snowflake();
	const newUser: User = {
		id,
		username,
	};

	if (avatar) {
		// TODO: upload user avatar
	}

	const commit = await kv.atomic().set(["users", "id", newUser.id], newUser)
		.set(["users", "password", newUser.id], await hash(password)).set([
			"users",
			"username",
			newUser.username,
		], newUser.id).commit();

	if (commit.ok) {
		return newUser;
	} else {
		throw new Error("Failed to create user");
	}
}

export async function retrieveUser(userId: string) {
	const user = await kv.get<User>(["users", "id", userId]);
	return user.value;
}

export interface User {
	avatar?: string;
	id: string;
	username: string;
}
