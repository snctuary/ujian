interface Props {
	label: string;
	path: `/${string}`;
}

export function Back({ label, path }: Props) {
	return (
		<div>
			<button
				type="button"
				class="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all ease-in-out duration-150"
				onClick={() => {
					globalThis.location.href = path;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="arrow-circle-down"
					viewBox="0 0 24 24"
					width="22"
					height="22"
				>
					<path d="M24,12A12,12,0,1,0,12,24,12.013,12.013,0,0,0,24,12ZM8,12a2.993,2.993,0,0,1,.752-1.987c.291-.327.574-.637.777-.84L12.353,6.3a1,1,0,0,1,1.426,1.4L10.95,10.58c-.187.188-.441.468-.7.759a1,1,0,0,0,0,1.323c.258.29.512.57.693.752L13.779,16.3a1,1,0,0,1-1.426,1.4L9.524,14.822c-.2-.2-.48-.507-.769-.833A2.99,2.99,0,0,1,8,12Z" />
				</svg>
				<p>{label}</p>
			</button>
		</div>
	);
}
