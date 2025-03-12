import { useState } from "preact/hooks";
import { TestDraft, TestQuestion } from "~/utils/server/tests.ts";

interface Props {
	classroomId?: string;
	draft?: TestDraft;
}

export function DraftEditor({}: Props) {
	const [questions, setQuestions] = useState<TestQuestion[]>([]);

	return (
		<div class="flex flex-col min-h-full font-[Outfit]">
			<div class="flex items-center justify-between p-3">
				<div class="flex items-center gap-2">
					<button type="button">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.75"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-chevron-left"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>
					<input />
				</div>
			</div>
		</div>
	);
}
