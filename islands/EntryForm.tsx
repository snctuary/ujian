import { useState } from "preact/hooks";

interface Props {
	mode: "login" | "signup";
}

export function EntryForm({ mode }: Props) {
	const [username, setUsername] = useState<string>();
	const [password, setPassword] = useState<string>();
	const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

	return (
		<div class="flex flex-col justify-center items-center gap-3 p-4 min-h-full relative">
			<form
				class="flex flex-col gap-2 mt-3 fill-slate-800"
				method="POST"
				autocomplete="off"
			>
				<div class="flex flex-col gap-2">
					<p class="text-4xl font-bold">
						{mode === "login" ? "Login" : "Sign Up"}
					</p>
					<p class="text-gray-500 text-sm">
						{mode === "login"
							? "Log in to continue"
							: "Create an account to continue"}
					</p>
				</div>
				<div class="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="Layer_1"
						data-name="Layer 1"
						viewBox="0 0 24 24"
						width="18"
						height="18"
					>
						<path d="m18.5,4h-3.5v-1c0-1.654-1.346-3-3-3s-3,1.346-3,3v1h-3.5C2.467,4,0,6.468,0,9.5v9c0,3.032,2.467,5.5,5.5,5.5h13c3.033,0,5.5-2.468,5.5-5.5v-9c0-3.032-2.467-5.5-5.5-5.5Zm2.5,14.5c0,1.379-1.122,2.5-2.5,2.5H5.5c-1.378,0-2.5-1.121-2.5-2.5v-9c0-1.379,1.122-2.5,2.5-2.5h3.769c.346.597.992,1,1.731,1h2c.739,0,1.385-.403,1.731-1h3.769c1.378,0,2.5,1.121,2.5,2.5v9Zm-11.5-7c0-1.379,1.121-2.5,2.5-2.5s2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5-2.5-1.121-2.5-2.5Zm6.475,6.5c.062.239.009.494-.143.69-.152.195-.384.31-.632.31h-6.4c-.248,0-.48-.114-.632-.31-.152-.196-.205-.45-.143-.69.448-1.739,2.119-3,3.975-3s3.526,1.262,3.975,3Z" />
					</svg>

					<input
						class="bg-transparent font-semibold outline-none grow text-sm"
						name="username"
						type="text"
						placeholder="Username"
						onInput={(input) => setUsername(input.currentTarget.value)}
					/>
				</div>
				<div class="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="Layer_1"
						data-name="Layer 1"
						viewBox="0 0 24 24"
						width="18"
						height="18"
					>
						<path d="M12.5,13.5c0,.828-.671,1.5-1.5,1.5H5.5c-3.033,0-5.5-2.468-5.5-5.5v-2C0,4.468,2.467,2,5.5,2h13c3.032,0,5.5,2.468,5.5,5.5,0,.828-.672,1.5-1.5,1.5s-1.5-.672-1.5-1.5c0-1.379-1.121-2.5-2.5-2.5H5.5c-1.378,0-2.5,1.121-2.5,2.5v2c0,1.379,1.122,2.5,2.5,2.5h5.5c.829,0,1.5,.672,1.5,1.5Zm11.5,4.5v3c0,1.657-1.343,3-3,3h-5c-1.657,0-3-1.343-3-3v-3c0-.885,.39-1.672,1-2.221v-2.279c0-2.481,2.019-4.5,4.5-4.5s4.5,2.019,4.5,4.5v2.279c.61,.549,1,1.336,1,2.221Zm-7-4.5v1.5h3v-1.5c0-.827-.673-1.5-1.5-1.5s-1.5,.673-1.5,1.5Zm3,6c0-.828-.672-1.5-1.5-1.5s-1.5,.672-1.5,1.5,.672,1.5,1.5,1.5,1.5-.672,1.5-1.5ZM11.029,10.457c.195,.195,.451,.293,.707,.293s.512-.098,.707-.293l2.5-2.5c.391-.391,.391-1.023,0-1.414s-1.023-.391-1.414,0l-.543,.543-.543-.543c-.391-.391-1.023-.391-1.414,0s-.391,1.023,0,1.414l.543,.543-.543,.543c-.391,.391-.391,1.023,0,1.414Zm-1.836-3.914c-.391-.391-1.023-.391-1.414,0l-.543,.543-.543-.543c-.391-.391-1.023-.391-1.414,0s-.391,1.023,0,1.414l.543,.543-.543,.543c-.391,.391-.391,1.023,0,1.414,.195,.195,.451,.293,.707,.293s.512-.098,.707-.293l.543-.543,.543,.543c.195,.195,.451,.293,.707,.293s.512-.098,.707-.293c.391-.391,.391-1.023,0-1.414l-.543-.543,.543-.543c.391-.391,.391-1.023,0-1.414Z" />
					</svg>

					<input
						class="bg-transparent font-semibold outline-none grow text-sm"
						name="password"
						type="password"
						placeholder="Password"
						onInput={(input) => setPassword(input.currentTarget.value)}
					/>
				</div>
				<button
					class="flex justify-center items-center mt-2 gap-1 p-2 bg-black text-white text-xs font-semibold rounded-lg transition ease-in-out duration-150 disabled:opacity-50"
					disabled={!username || !password || isLoggingIn}
					type="submit"
					onClick={() => setIsLoggingIn(true)}
				>
					<p>{mode === "login" ? "Log In" : "Start"}</p>
					<svg
						class="fill-white"
						xmlns="http://www.w3.org/2000/svg"
						id="Bold"
						viewBox="0 0 24 24"
						width="18"
						height="18"
					>
						<path d="M15.75,9.525,11.164,4.939A1.5,1.5,0,0,0,9.043,7.061l4.586,4.585a.5.5,0,0,1,0,.708L9.043,16.939a1.5,1.5,0,0,0,2.121,2.122l4.586-4.586A3.505,3.505,0,0,0,15.75,9.525Z" />
					</svg>
				</button>
			</form>
		</div>
	);
}
