import { Classroom } from "~/utils/server/classrooms.ts";
import { useState } from "preact/hooks";
import { CreateClassroom } from "~/islands/beta/CreateClassroom.tsx";

interface Props {
	currentClassroomId?: string;
	classrooms: Classroom[];
}

export function ClassroomSwitcher({ currentClassroomId, classrooms }: Props) {
	const [query, setQuery] = useState<string>("");
	const currentClassroom = classrooms.find((classroom) =>
		classroom.id === currentClassroomId
	);
	const filteredClassrooms = classrooms.filter((classroom) =>
		classroom.name.toLowerCase().includes(query.toLowerCase())
	);
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div class="relative">
			<button
				class="flex justify-between items-center w-56 md:w-64 bg-white px-3 py-2 gap-2 rounded-xl shadow-md md:shadow-none border md:border-none border-gray-200"
				onClick={() => setOpen(!open)}
				type="button"
			>
				<div class="flex items-center gap-2">
					<div class="bg-black size-8 rounded-full"></div>
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
					<div class="flex gap-2 mb-2">
						<div class="flex items-center rounded-xl border border-gray-300 shadow-md relative overflow-hidden grow">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.75"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="absolute left-2 stroke-gray-400 lucide lucide-search"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.3-4.3" />
							</svg>
							<input
								class="outline-none pl-8 pr-1 h-6 text-sm placeholder:text-gray-400 grow"
								placeholder="Search a classroom"
								size={1}
								onInput={(input) => setQuery(input.currentTarget.value)}
								type="text"
							/>
						</div>
						<CreateClassroom />
					</div>
					{filteredClassrooms.length >= 1
						? (
							<div class="flex flex-col gap-1 justify-center">
								{filteredClassrooms.map((classroom) => (
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
