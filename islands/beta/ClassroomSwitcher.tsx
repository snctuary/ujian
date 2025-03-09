import { Classroom } from "~/utils/server/classrooms.ts";
import { useState } from "preact/hooks";

interface Props {
	currentClassroomId?: string;
	classrooms: Classroom[];
}

export function ClassroomSwitcher({ currentClassroomId, classrooms }: Props) {
	const currentClassroom = classrooms.find((classroom) =>
		classroom.id === currentClassroomId
	);
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div class="relative">
			<button
				class="flex justify-between items-center w-64 bg-white p-3 gap-2 rounded-xl"
				onClick={() => setOpen(!open)}
				type="button"
			>
				<div class="flex items-center gap-2">
					<div class="bg-black size-10 rounded-full"></div>
					<div class="flex flex-col items-start font-semibold">
						<p>
							{currentClassroom?.name ?? "Select Class"}
						</p>
						{currentClassroom?.memberCount && (
							<p class="text-gray-500 text-sm">
								{currentClassroom.memberCount} members
							</p>
						)}
					</div>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-chevrons-up-down"
				>
					<path d="m7 15 5 5 5-5" />
					<path d="m7 9 5-5 5 5" />
				</svg>
			</button>
			{open && (
				<div
					class="flex flex-col justify-center p-3 rounded-xl bg-white absolute mt-2 w-full border border-gray-400 shadow-lg"
					f-client-nav={false}
				>
					{classrooms.length >= 1
						? (
							<div class="flex flex-col gap-1 justify-center">
								{classrooms.map((classroom) => (
									<a
										class="flex hover:bg-slate-100 rounded-lg px-2 py-1"
										href={`/beta/classrooms/${classroom.id}/tests`}
										type="button"
									>
										<p>{classroom.name}</p>
									</a>
								))}
							</div>
						)
						: (
							<div class="flex justify-center">
								<p class="font-semibold">No Classrooms</p>
							</div>
						)}
				</div>
			)}
		</div>
	);
}
