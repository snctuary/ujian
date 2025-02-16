import { ClassroomNavigationButton } from "~/components/ClassroomNavigationButton.tsx";

interface Props {
	classroomId: string;
}

export function ClassroomNavigation({ classroomId }: Props) {
	return (
		<>
			<div class="hidden md:flex flex-col md:gap-2 w-full max-w-56 overflow-y-auto no-scrollbar">
				<ClassroomNavigationButton
					classroomId={classroomId}
					label="Overview"
					path="/overview"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="Bold"
						viewBox="0 0 24 24"
						width="18"
						height="18"
					>
						<path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,21a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Z" />
						<path d="M11.545,9.545h-.3A1.577,1.577,0,0,0,9.64,10.938,1.5,1.5,0,0,0,11,12.532v4.65a1.5,1.5,0,0,0,3,0V12A2.455,2.455,0,0,0,11.545,9.545Z" />
						<path d="M11.83,8.466A1.716,1.716,0,1,0,10.114,6.75,1.715,1.715,0,0,0,11.83,8.466Z" />
					</svg>
				</ClassroomNavigationButton>
				<ClassroomNavigationButton
					classroomId={classroomId}
					label="Members"
					path="/members"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="Layer_1"
						data-name="Layer 1"
						viewBox="0 0 24 24"
						width="18"
						height="18"
					>
						<path d="M21,11h-5.001c-1.657,0-3,1.343-3,3v7.001c0,1.656,1.343,2.999,2.999,3l5,.003c1.657,0,3.002-1.343,3.002-3v-7.003c0-1.657-1.343-3-3-3Zm-4.001,2.997h3c.552,0,1,.448,1,1,0,.552-.448,1-1,1h-3c-.552,0-1-.448-1-1,0-.552,.448-1,1-1Zm3,6.003h-3c-.552-.001-1-.449-1-1.001h0c0-.554,.448-1.002,1-1.002h3c.552,0,1,.448,1,1v.003c0,.552-.448,1-1,1Zm-10.999-8c3.309,0,6-2.691,6-6S12.309,0,9,0,3,2.691,3,6s2.691,6,6,6Zm0-9c1.654,0,3,1.346,3,3s-1.346,3-3,3-3-1.346-3-3,1.346-3,3-3Zm2,12.472c.016,.828-.644,1.512-1.472,1.527l-1.047,.02c-2.896,.21-5.288,2.61-5.484,5.58-.053,.793-.713,1.401-1.495,1.401-.034,0-.067,0-.102-.003-.826-.055-1.452-.769-1.397-1.596,.296-4.457,3.882-8.058,8.343-8.377l1.126-.023c.845-.048,1.513,.643,1.528,1.472Z" />
					</svg>
				</ClassroomNavigationButton>
			</div>
		</>
	);
}
