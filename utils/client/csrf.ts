import { createToken } from "~/utils/server/session.ts";

async function retrieveCsrfToken(stateUpdater: (value: string) => void) {
	const response = await fetch("/api/csrf");
	if (response.ok) {
		const csrfToken: Awaited<ReturnType<typeof createToken>> = await response
			.json();
		return stateUpdater(csrfToken.data);
	}
}

export function handleCsrf(stateUpdater: (value: string) => void) {
	retrieveCsrfToken(stateUpdater);
	setInterval(
		() => retrieveCsrfToken(stateUpdater),
		5 * 60 * 1_000,
	);
}
