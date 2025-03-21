import { define } from "~/utils/server/core.ts";

export default define.page(({ Component }) => {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="google" content="notranslate" />
				<title>Ujian</title>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body class="h-dvh">
				<Component />
			</body>
		</html>
	);
});
