import { useEffect, useState } from "preact/hooks";
import { handleCsrf } from "~/utils/client/csrf.ts";

interface Props {
	currentAvatar?: string;
	username: string;
}

export function ProfileEditor({ currentAvatar, username }: Props) {
	const [avatar, setAvatar] = useState<File>();
	const [preview, setPreview] = useState<string | null>(null);

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

	return (
		<form
			id="profile"
			class="flex flex-col gap-1"
			method="POST"
			action="/api/users/me"
		>
			<input class="hidden" name="_csrf" type="text" value={csrf} />
			<p class="font-medium text-lg">My Profile</p>
			<div class="flex items-center gap-3">
				<div class="relative size-20">
					<label for="avatar">
						<div class="bg-slate-100 size-full rounded-full overflow-hidden border border-gray-100">
							{(currentAvatar || preview) && (
								<img
									class="size-full object-cover"
									src={preview ?? currentAvatar}
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
		</form>
	);
}
