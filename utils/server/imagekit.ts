import ImageKit from "imagekit";
import { env } from "~/utils/server/env.ts";

export function kit() {
	return new ImageKit({
		publicKey: env("IMAGEKIT_PUBLIC_KEY", true),
		privateKey: env("IMAGEKIT_PRIVATE_KEY", true),
		urlEndpoint: env("IMAGEKIT_URL_ENDPOINT", true),
	});
}
