import { ClassroomWithHomeroomTeacher } from "~/utils/server/classrooms.ts";
import { ClassroomItem } from "~/components/ClassroomItem.tsx";
import { useState } from "preact/hooks";
import { Modal } from "~/islands/Modal.tsx";
import { CreateClassroom } from "~/islands/CreateClassroom.tsx";

interface Props {
	classrooms: ClassroomWithHomeroomTeacher[];
}

export function ClassroomList({ classrooms }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [query, setQuery] = useState<string>();
	const [showCreateClassModal, setShowCreateClassModal] = useState<boolean>(
		false,
	);

	return (
		<div class="flex flex-col">
			<div class="flex py-2 gap-2 fill-slate-400">
				<div class="flex items-center grow bg-slate-100 hover:bg-slate-200 gap-3 px-4 rounded-lg transition-all ease-in-out duration-150">
					<input
						class="grow bg-transparent placeholder:text-slate-400 py-3 font-bold outline-none"
						placeholder="Search"
						size={1}
						onInput={(input) => setQuery(input.currentTarget.value)}
					/>
					<svg
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
				<div class="relative">
					<button onClick={() => setOpen(!open)}>
						<div class="flex justify-center items-center bg-slate-100 hover:bg-slate-200 rounded-lg size-12 transition-all ease-in-out duration-150">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								version="1.1"
								id="Capa_1"
								x="0px"
								y="0px"
								viewBox="0 0 512 512"
								style="enable-background:new 0 0 512 512;"
								xml:space="preserve"
								width="18"
								height="18"
							>
								<g>
									<path d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
								</g>
							</svg>
						</div>
					</button>
					<div
						data-open={open}
						class="flex flex-col opacity-0 data-[open=true]:opacity-100 bg-[#f7f7f7] fill-slate-500 font-semibold text-slate-400 text-sm w-56 p-4 rounded-lg shadow-md absolute right-0 data-[open=true]:-right-25 mt-2 transition-opacity ease-in-out duration-150"
					>
						<button
							class="flex items-center gap-3 hover:bg-gray-200 hover:text-slate-500 p-1.5 rounded-lg transition-all ease-out duration-300"
							onClick={() => {
								setOpen(false);
								setShowCreateClassModal(true);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Layer_1"
								data-name="Layer 1"
								viewBox="0 0 24 24"
								width="18"
								height="18"
							>
								<path d="m11,4h-1c0,.552-.448,1-1,1h-.851l.85,11.414c.049,1.414-1.084,2.586-2.498,2.586s-2.547-1.173-2.498-2.586l.85-11.414H1c-1,0-1-1-1-1C0,1.791,1.791,0,4,0h5c.552,0,1,.448,1,1h1c0-.552.448-1,1-1s1,.448,1,1v3c0,.552-.448,1-1,1s-1-.448-1-1Zm4.358,8.522l-2.173,1.052c-.998.508-1.714,1.389-2.019,2.426h12.668c-.306-1.036-1.021-1.917-2.018-2.425l-2.174-1.053c-.398-.193-.623-.623-.551-1.06.431-2.634.909-5.65.909-5.962,0-1.379-1.121-2.5-2.5-2.5s-2.5,1.121-2.5,2.5c0,.312.478,3.328.909,5.962.072.437-.153.867-.551,1.06Zm-4.358,5.478v3c0,1.654,1.346,3,3,3l.944-3.614c.193-.514.92-.514,1.113,0l.944,3.614h4c1.654,0,3-1.346,3-3v-3h-13Z" />
							</svg>
							<p>Create a Class</p>
						</button>
					</div>
				</div>
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
			<Modal
				open={showCreateClassModal}
				stateUpdater={setShowCreateClassModal}
				title="Create a Class"
			>
				<CreateClassroom />
			</Modal>
		</div>
	);
}
