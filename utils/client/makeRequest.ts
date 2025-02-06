import { createToken } from "~/utils/server/session.ts";

interface RequestOptions {
	method?: string;
	body?: BodyInit;
	headers?: Record<string, string>;
}

export async function makeRequest<T = void>(
	route: `/${string}`,
	{ body, method, headers }: RequestOptions,
) {
	const csrfResponse = await fetch("/api/csrf");
	const csrfToken: Awaited<ReturnType<typeof createToken>> = await csrfResponse
		.json();

	const response = await fetch(route, {
		method,
		body,
		headers: {
			...(headers ?? {}),
			"x-csrf-token": csrfToken.data,
		},
	});

	if (response.ok) {
		const data: T = await response.json();
		return data;
	}
}
