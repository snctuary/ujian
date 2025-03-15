export async function retrieveCsrf(request: Request) {
	const cloned = request.clone();
	if (
		cloned.headers.get("content-type") === "application/x-www-form-urlencoded"
	) {
		const data = await cloned.formData();
		return data.get("_csrf") as string | null;
	} else {
		return cloned.headers.get("x-csrf-token");
	}
}
