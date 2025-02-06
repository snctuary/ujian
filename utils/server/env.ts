export function env(key: string, required: true): string;
export function env(key: string, required?: boolean): string | undefined;
export function env(key: string, required?: boolean): string | undefined {
	const value = Deno.env.get(key);

	if (required && !value) {
		throw new Error(`Missing environment variable "${key}"`);
	}

	return value;
}
