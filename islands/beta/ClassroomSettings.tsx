import { Classroom } from "~/utils/server/classrooms.ts";
import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";

interface Props {
	classroom: Classroom;
}

export function ClassroomSettings({ classroom }: Props) {
	const [currentName, _setCurrentName] = useState<string>(classroom.name);
	const [name, setName] = useState<string>(classroom.name);
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
	const [isRenaming, setIsRenaming] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	async function renameClassroom() {
		if (csrf && (name !== currentName)) {
			setIsRenaming(true);
			const response = await makeRequest<Classroom>(
				`/beta/api/classrooms/${classroom.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({ name }),
					csrfToken: csrf,
				},
			);

			if (response.ok && response.data) {
				globalThis.location.reload();
			}
			setIsRenaming(false);
		}
	}

	return (
		<div class="flex flex-col grow relative gap-2 border border-gray-300 rounded-xl p-4 overflow-y-auto no-scrollbar">
			<p class="font-semibold">Classroom Name</p>
			<div class="flex gap-2 -mt-1">
				<input
					class="flex grow p-1.5 bg-slate-100 rounded-lg"
					onInput={(input) => setName(input.currentTarget.value)}
					size={1}
					value={name}
				/>
				<button
					class="rounded-xl bg-black text-white font-medium text-sm px-3 py-1.5 disabled:opacity-50 transition-all ease-in-out duration-150"
					type="button"
					onClick={() => renameClassroom()}
					disabled={isRenaming || (name === currentName)}
				>
					Rename
				</button>
			</div>
			<div class="flex flex-col border border-red-500 rounded-xl p-4 mt-8">
				<p class="text-lg font-medium">Delete Classroom</p>
				<p class="text-sm text-gray-500 mb-2">This action is not reversible</p>
				{!confirmDelete
					? (
						<div>
							<button
								class="rounded-xl bg-red-500 text-white font-medium text-sm px-4 py-2 disabled:opacity-50 transition-all ease-in-out duration-150"
								type="button"
								onClick={() => setConfirmDelete(true)}
								disabled={confirmDelete}
							>
								Delete
							</button>
						</div>
					)
					: (
						<div class="flex flex-col gap-1">
							<p class="font-semibold">Are you sure?</p>
							<div class="flex gap-1">
								<button
									class="rounded-xl bg-red-500 text-white font-medium text-sm px-4 py-2 disabled:opacity-50 transition-all ease-in-out duration-150"
									type="button"
									disabled={!confirmDelete}
								>
									Yes, I'm sure
								</button>
								<button
									class="rounded-xl bg-slate-200 text-black font-medium text-sm px-4 py-2 disabled:opacity-50 transition-all ease-in-out duration-150"
									type="button"
									onClick={() => setConfirmDelete(false)}
									disabled={!confirmDelete}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
			</div>
		</div>
	);
}
