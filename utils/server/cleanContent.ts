export function cleanContent(content: string) {
	return content.replaceAll(
		new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g"),
		"",
	);
}
