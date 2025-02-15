import { useEffect, useState } from "preact/hooks";
import { createToken } from "~/utils/server/session.ts";

async function retrieveCsrfToken(stateUpdater: (value: string) => void) {
	const response = await fetch("/api/csrf");
	if (response.ok) {
		const csrfToken: Awaited<ReturnType<typeof createToken>> = await response
			.json();
		stateUpdater(csrfToken.data);
	}
}

export function handleCsrf() {
	const [csrfToken, setCsrfToken] = useState<string>();

	useEffect(() => {
		retrieveCsrfToken(setCsrfToken);
		setInterval(() => {
			retrieveCsrfToken(setCsrfToken);
		}, 5 * 60_000);
	}, []);

	return csrfToken;
}
