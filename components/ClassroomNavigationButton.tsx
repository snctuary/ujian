import { ComponentChildren } from "preact";

interface Props {
	children: ComponentChildren;
	classroomId: string;
	label: string;
	path: `/${string}`;
}

export function ClassroomNavigationButton(
	{ children, classroomId, label, path }: Props,
) {
	return (
		<a class="group" href={`/classrooms/${classroomId}` + path}>
			<div class="flex items-center gap-2 px-3 py-2 fill-current text-slate-500 font-semibold group-aria-[current]:bg-slate-100 hover:bg-slate-100 rounded-lg transition-all ease-in-out duration-200">
				{children}
				<p class="hidden md:flex">{label}</p>
			</div>
		</a>
	);
}
