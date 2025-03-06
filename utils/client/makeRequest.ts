import { STATUS_CODE } from "@std/http/status";

interface RequestOptions {
	csrfToken: string;
	method?: string;
	body?: BodyInit;
	headers?: Record<string, string>;
}

export async function makeRequest<T = unknown>(
	route: `/${string}`,
	{ csrfToken, body, method, headers }: RequestOptions,
) {
	const response = await fetch(route, {
		method,
		body,
		headers: {
			...(headers ?? {}),
			"x-csrf-token": csrfToken,
		},
	});

	if (response.ok) {
		let data: T | null = null;

		if (response.status !== STATUS_CODE.NoContent) {
			data = await response.json();
		}
		return { data, ok: response.ok };
	} else {
		return { ok: false };
	}
}
