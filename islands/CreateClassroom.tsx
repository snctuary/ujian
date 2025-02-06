import { useState } from "preact/hooks";
import { makeRequest } from "~/utils/client/makeRequest.ts";
import { Classroom } from "~/utils/server/classrooms.ts";
import { CreateClassroomData } from "~/routes/api/classrooms/index.ts";

export function CreateClassroom() {
	const [name, setName] = useState<string>();
	const [submitting, setSubmitting] = useState<boolean>(false);

	async function createClassroom() {
		if (name) {
			setSubmitting(true);
			const data: CreateClassroomData = {
				name,
			};
			const body = JSON.stringify(data);
			const classroom = await makeRequest<Classroom>("/api/classrooms", {
				method: "POST",
				body,
			});

			if (classroom) {
				globalThis.location.href = `/classrooms/${classroom.id}/overview`;
			}
			setSubmitting(false);
		}
	}

	return (
		<div class="flex flex-col gap-2">
			<div class="flex flex-col">
				<label class="font-bold" for="name">Class Name</label>
				<input
					class="bg-slate-100 p-2 rounded-lg font-extrabold outline-none"
					id="name"
					onInput={(input) => setName(input.currentTarget.value)}
				/>
			</div>
			<button
				class="flex justify-center text-white bg-[#131313] rounded-xl p-2 font-extrabold disabled:opacity-50 transition-alll ease-in-out duration-150"
				disabled={!name || submitting}
				onClick={() => createClassroom()}
			>
				Create
			</button>
		</div>
	);
}
