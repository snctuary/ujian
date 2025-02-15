interface RequestOptions {
	csrfToken: string;
	method?: string;
	body?: BodyInit;
	headers?: Record<string, string>;
}

export async function makeRequest<T = void>(
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
		const data: T = await response.json();
		return data;
	}
}
