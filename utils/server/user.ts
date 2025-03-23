import { kv } from "~/utils/server/core.ts";
import { snowflake } from "~/utils/server/snowflake.ts";
import { hash } from "@bronti/bcrypt";
import { encodeBase64 } from "@std/encoding/base64";
import { encodeHex } from "@std/encoding/hex";
import { kit } from "~/utils/server/imagekit.ts";
import { env } from "~/utils/server/env.ts";

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

export async function updateUser(user: User, data: UpdateUserData) {
	const newData: User = user;

	const atomic = kv.atomic();

	if (data.avatar) {
		const avatarIdKey = ["users", "id", user.id, "avatar"];
		const oldAvatarId = await kv.get<string>(avatarIdKey);

		if (oldAvatarId.value) {
			await kit().deleteFile(oldAvatarId.value);
		}

		const encoded = encodeBase64(await data.avatar.arrayBuffer());
		const uploadedAvatar = await kit().upload({
			file: encoded,
			fileName: encodeHex(crypto.randomUUID()),
			folder: `${env("IMAGEKIT_FOLDER_PATH")}/avatars/${user.id}`,
		});

		newData.avatarUrl = uploadedAvatar.url;
		atomic.set(avatarIdKey, uploadedAvatar.fileId);
	}

	const commit = await kv.set(["users", "id", user.id], newData);

	if (commit.ok) {
		return newData;
	} else {
		throw new Error("Failed to update user");
	}
}

export interface User {
	avatarUrl?: string;
	id: string;
	username: string;
}

export interface UpdateUserData extends Partial<Pick<User, "username">> {
	avatar?: File | null;
}
