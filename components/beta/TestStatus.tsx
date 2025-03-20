import { TestStatusCode } from "~/utils/server/tests.ts";

interface Props {
	status: TestStatusCode;
	statusText: keyof typeof TestStatusCode;
}

export function TestStatus({ status, statusText }: Props) {
	return (
		<div
			data-status={status}
			class="flex gap-1 px-4 py-2 rounded-full data-[status=1]:bg-purple-100 data-[status=1]:text-purple-500 data-[status=2]:bg-red-100 data-[status=2]:text-red-500 data-[status=3]:bg-green-100 data-[status=3]:text-green-400"
		>
			<p class="text-xs font-medium">{statusText}</p>
		</div>
	);
}
