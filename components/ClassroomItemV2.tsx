import { Classroom } from "~/utils/server/classrooms.ts";
import { User } from "~/utils/server/user.ts";

interface Props {
	classroom: Classroom;
	homeroomTeacher: User;
}

export function ClassroomItemV2({ classroom, homeroomTeacher }: Props) {
	return (
		<a href={`/classrooms/${classroom.id}/overview`}>
			<div class="h-36 bg-[#131313] hover:bg-[#222222] text-white rounded-lg w-full relative group transition-all ease-in-out duration-150 ">
				<div class="flex items-center absolute bottom-0 font-semibold p-2 w-full">
					<div class="flex flex-col grow">
						<p class="text-2xl group-hover:text-3xl transition-all ease-in-out duration-150">
							{classroom.name}
						</p>
						<div class="flex items-center gap-1 group-hover:gap-0 transition-all ease-in-out duration-150">
							<div class="bg-slate-200 size-6 group-hover:size-0 rounded-full transition-all ease-in-out duration-150">
							</div>
							<p>{homeroomTeacher.username}</p>
						</div>
					</div>
					<svg
						class="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-150"
						fill="white"
						xmlns="http://www.w3.org/2000/svg"
						id="Bold"
						viewBox="0 0 24 24"
						width="18"
						height="18"
					>
						<path d="M6.079,22.5a1.5,1.5,0,0,1,.44-1.06l7.672-7.672a2.5,2.5,0,0,0,0-3.536L6.529,2.565A1.5,1.5,0,0,1,8.65.444l7.662,7.661a5.506,5.506,0,0,1,0,7.779L8.64,23.556A1.5,1.5,0,0,1,6.079,22.5Z" />
					</svg>
				</div>
			</div>
		</a>
	);
}
