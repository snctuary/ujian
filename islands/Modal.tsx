import { ComponentChildren } from "preact";

interface Props {
	children: ComponentChildren;
	open: boolean;
	stateUpdater: (state: boolean) => void;
	title: string;
}

export function Modal({ children, open, stateUpdater, title }: Props) {
	return (
		<div
			data-open={open}
			class="hidden data-[open=true]:flex justify-center items-center p-3 fixed top-0 left-0 size-full bg-black/75"
		>
			<div class="flex flex-col w-full max-w-96 bg-white rounded-lg gap-3 p-3">
				<div class="flex items-center gap-2">
					<div class="grow">
						<p class="font-bold text-2xl">{title}</p>
					</div>
					<button
						class="flex justify-center items-center rounded-lg hover:bg-slate-100 hover:fill-red-500 p-2 transition-all ease-in-out duration-200"
						onClick={() => stateUpdater(false)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							version="1.1"
							id="Capa_1"
							x="0px"
							y="0px"
							viewBox="0 0 512.021 512.021"
							style="enable-background:new 0 0 512.021 512.021;"
							xml:space="preserve"
							width="14"
							height="14"
						>
							<g>
								<path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z" />
							</g>
						</svg>
					</button>
				</div>
				<div class="grow overflow-y-auto no-scroll">
					{children}
				</div>
			</div>
		</div>
	);
}
