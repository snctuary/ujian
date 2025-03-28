interface Props {
	classroomId: string;
	testId: string;
	disabled: boolean;
}

export function BeginTest({ classroomId, testId, disabled }: Props) {
	return (
		<button
			class="flex w-full justify-center items-center p-3 gap-3 fill-current text-white disabled:hover:text-white hover:text-black font-semibold bg-black disabled:hover:bg-black hover:bg-white border-2 border-black rounded-full transition-all ease-in-out duration-75 disabled:opacity-25"
			onClick={() =>
				globalThis.location.href = `/classrooms/${classroomId}/tests/${testId}`}
			disabled={disabled}
			type="button"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				id="Layer_1"
				data-name="Layer 1"
				viewBox="0 0 24 24"
				width="18"
				height="18"
			>
				<path d="M10.53,16h-1.53c-.56,0-1.01-.45-1.01-1.01v-1.53c0-.8,.32-1.56,.88-2.12l6.58-6.57,3.78,3.78-6.57,6.58c-.56,.56-1.33,.88-2.12,.88ZM23.22,4.56c1.04-1.04,1.04-2.73,0-3.78-1.04-1.04-2.73-1.04-3.78,0l-1.87,1.87,3.78,3.78,1.87-1.87Zm-.72,16.44c-.17,0-.36-.25-.75-.83-.58-.86-1.45-2.17-3.25-2.17s-2.67,1.3-3.25,2.17c-.78,1.17-.72,1.17-1.5,0-.58-.86-1.45-2.17-3.25-2.17-1.61,0-2.47,1.05-3.1,1.82-.65,.79-1,1.18-1.9,1.18-1.38,0-2.5-1.12-2.5-2.5,0-1.14,.77-2.14,1.87-2.42,.8-.21,1.29-1.02,1.08-1.83s-1.02-1.28-1.83-1.08c-2.43,.63-4.13,2.82-4.13,5.33,0,3.03,2.47,5.5,5.5,5.5,2.36,0,3.48-1.37,4.22-2.28,.44-.54,.62-.72,.78-.72,.17,0,.36,.25,.75,.83,.58,.86,1.45,2.17,3.25,2.17s2.67-1.3,3.25-2.17c.78-1.17,.72-1.17,1.5,0,.58,.86,1.45,2.17,3.25,2.17,.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5Z" />
			</svg>
			<p>Begin Test</p>
		</button>
	);
}
