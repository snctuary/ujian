import { useEffect, useState } from "preact/hooks";
import { makeRequest } from "~/utils/client/makeRequest.ts";
import { Classroom } from "~/utils/server/classrooms.ts";
import { CreateClassroomData } from "~/routes/api/classrooms/index.ts";
import { handleCsrf } from "~/utils/client/csrf.ts";

export function CreateClassroom() {
	const [name, setName] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [csrf, setCsrf] = useState<string>();

	useEffect(() => handleCsrf(setCsrf), []);

	async function createClassroom() {
		if (name && csrf) {
			setSubmitting(true);
			const data: CreateClassroomData = {
				name,
				description,
			};
			const body = JSON.stringify(data);
			const classroom = await makeRequest<Classroom>("/api/classrooms", {
				method: "POST",
				body,
				csrfToken: csrf,
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
				<label class="font-bold mt-4" for="name">Class Description</label>
				<textarea
					class="bg-slate-100 p-2 resize-none rounded-lg font-bold outline-none"
					id="description"
					onInput={(input) => setDescription(input.currentTarget.value)}
				/>
			</div>
			<button
				type="button"
				class="flex justify-center text-white bg-[#131313] rounded-xl p-2 font-extrabold disabled:opacity-50 transition-alll ease-in-out duration-150"
				disabled={!name || submitting}
				onClick={() => createClassroom()}
			>
				Create
			</button>
		</div>
	);
}
