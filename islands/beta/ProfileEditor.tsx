import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";
import { makeRequest } from "~/utils/client/makeRequest.ts";
import { User } from "~/utils/server/user.ts";

interface Props {
	avatarUrl?: string;
	username: string;
}

export function ProfileEditor({ avatarUrl, username }: Props) {
	const [avatar, setAvatar] = useState<File>();
	const [preview, setPreview] = useState<string | null>(avatarUrl ?? null);
	const [updating, setUpdating] = useState<boolean>(false);

	const [csrf, setCsrf] = useState<string>();
	useEffect(() => handleCsrf(setCsrf), []);

	useEffect(() => {
		if (avatar) {
			const previewUrl = URL.createObjectURL(avatar);
			setPreview(previewUrl);

			return () => URL.revokeObjectURL(previewUrl);
		} else {
			setPreview(null);
		}
	}, [avatar]);

	const notEligible = updating || !preview;

	async function update() {
		if (csrf) {
			setUpdating(true);
			const formData = new FormData();

			formData.set("payload_json", JSON.stringify({}));
			if (avatar) {
				formData.set("avatar", avatar);
			}

			const response = await makeRequest<User>(`/beta/api/users/me`, {
				method: "POST",
				body: formData,
				csrfToken: csrf,
			});

			if (response.ok) {
				globalThis.location.reload();
			}
			setUpdating(false);
		}
	}

	return (
		<div
			id="profile"
			class="flex flex-col gap-1"
		>
			<input class="hidden" name="_csrf" type="text" value={csrf} />
			<input
				class="hidden"
				name="payload_json"
				type="text"
				value={JSON.stringify({})}
			/>
			<p class="font-medium text-lg">My Profile</p>
			<div class="flex items-center max-w-80 gap-3">
				<div class="relative size-20">
					<label for="avatar">
						<div class="bg-slate-100 size-full rounded-full overflow-hidden border border-gray-100">
							{(avatarUrl || preview) && (
								<img
									class="size-full object-cover"
									src={preview ?? avatarUrl}
								/>
							)}
						</div>
					</label>
					<input
						id="avatar"
						name="avatar"
						class="hidden"
						type="file"
						accept="image/png, image/jpeg"
						onInput={(input) => {
							const uploaded = input.currentTarget.files?.item(0);

							if (uploaded) {
								setAvatar(uploaded);
							}
						}}
					/>
				</div>
				<input
					class="p-2 rounded-lg bg-slate-100 text-sm font-medium grow disabled:opacity-50"
					disabled
					type="text"
					size={1}
					value={username}
				/>
			</div>
			<div class="mt-2">
				<button
					class="bg-black px-3 py-2 text-sm text-white font-medium rounded-lg disabled:opacity-50"
					type="button"
					disabled={notEligible}
					onClick={() => update()}
				>
					{!updating ? "Update" : "Updating"}
				</button>
			</div>
		</div>
	);
}
