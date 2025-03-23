import { kv } from "~/utils/server/core.ts";
import { snowflake } from "~/utils/server/snowflake.ts";
import { hash } from "@bronti/bcrypt";

const FORMATTING_PATTERN = {
	Username: /^[a-z0-9]{3,20}$/,
};

interface CreateUserOptions extends Omit<User, "avatar" | "id"> {
	avatar?: Blob;
	password: string;
}
export async function createUser(
	{ avatar, password, username }: CreateUserOptions,
) {
	const id = snowflake();

	if (!username.match(FORMATTING_PATTERN.Username)) {
		throw new Error("Inavlid username format");
	} else {
		const newUser: User = {
			id,
			username,
		};

		if (avatar) {
			// TODO: upload user avatar
		}

		const usernameKey = ["users", "username", newUser.username];
		const commit = await kv.atomic().check({
			key: usernameKey,
			versionstamp: null,
		}).set(["users", "id", newUser.id], newUser)
			.set(["users", "password", newUser.id], await hash(password)).set(
				usernameKey,
				newUser.id,
			).commit();

		if (commit.ok) {
			return newUser;
		} else {
			throw new Error("Failed to create user");
		}
	}
}

export async function searchUser(
	username: string,
	fullData: true,
): Promise<User | null>;
export async function searchUser(
	username: string,
	fullData?: false,
): Promise<string | null>;
export async function searchUser(
	username: string,
	fullData?: boolean,
): Promise<string | User | null> {
	const userId = await kv.get<string>(["users", "username", username]);

	if (userId.value) {
		if (fullData) {
			const user = await retrieveUser(userId.value);
			return user;
		}
	}

	return userId.value;
}

export async function retrievePassword(userId: string) {
	const password = await kv.get<string>(["users", "password", userId]);
	return password.value;
}

export async function retrieveUser(
	userId: string,
	required: true,
): Promise<User>;
export async function retrieveUser(
	userId: string,
	required?: false,
): Promise<User | null>;
export async function retrieveUser(userId: string, required?: boolean) {
	const user = await kv.get<User>(["users", "id", userId]);

	if (required && !user.value) {
		throw new Error("Unknown User");
	}

	return user.value;
}

export interface User {
	avatarUrl?: string;
	id: string;
	username: string;
}
