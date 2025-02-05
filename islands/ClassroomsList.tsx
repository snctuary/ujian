import { ClassroomWithHomeroomTeacher } from "~/utils/classrooms.ts";
import { ClassroomItem } from "~/components/ClassroomItem.tsx";
import { useState } from "preact/hooks";

interface Props {
	classrooms: ClassroomWithHomeroomTeacher[];
}

export function ClassroomList({ classrooms }: Props) {
	const [query, setQuery] = useState<string>();

	return (
		<div class="flex flex-col size-full">
			<div class="flex items-center bg-slate-100 gap-3 px-4 rounded-lg">
				<input
					class="grow bg-transparent placeholder:text-slate-400 py-3 font-bold outline-none"
					placeholder="Search"
					size={1}
					onInput={(input) => setQuery(input.currentTarget.value)}
				/>
				<svg
					class="fill-slate-400"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					id="Capa_1"
					x="0px"
					y="0px"
					viewBox="0 0 513.749 513.749"
					style="enable-background:new 0 0 513.749 513.749;"
					xml:space="preserve"
					width="18"
					height="18"
				>
					<g>
						<path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15   S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0   c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160   s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
					</g>
				</svg>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-8 grow overflow-y-auto no-scrollbar">
				{classrooms.filter((classroom) =>
					classroom.name.toLowerCase().includes(query?.toLowerCase() ?? "")
				).map((classroom) => (
					<ClassroomItem
						classroom={classroom}
						homeroomTeacher={classroom.homeroomTeacher}
					/>
				))}
			</div>
		</div>
	);
}
