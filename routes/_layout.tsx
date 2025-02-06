import { Partial } from "fresh/runtime";
import { RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default define.page((ctx) => {
	return (
		<div class="flex flex-col md:flex-row h-dvh select-none" f-client-nav>
			<div class="flex flex-col gap-3 p-5 grow overflow-y-auto">
				<div class="flex gap-2">
					<div class="grow">
						<Partial name="title">
							<p class="text-4xl font-extrabold">{ctx.state.title}</p>
						</Partial>
					</div>
					<div class="bg-slate-200 rounded-full size-10"></div>
				</div>
				<div class="grow overflow-y-auto">
					<Partial name="content">
						<ctx.Component />
					</Partial>
				</div>
			</div>
			<div class="flex md:flex-col justify-center items-center gap-6 p-6 md:order-first bg-white">
				<a class="group" href="/home">
					<div class="rounded-full p-4 fill-[#131313] group-aria-[current]:fill-white group-aria-[current]:bg-[#131313] transition-all ease-in-out duration-150">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							id="Layer_1"
							data-name="Layer 1"
							viewBox="0 0 24 24"
							width="22"
							height="22"
						>
							<path d="M18.5,24H5.5c-3.032,0-5.5-2.468-5.5-5.5V9.886c0-1.83,.906-3.534,2.424-4.559L8.924,.941c1.867-1.262,4.284-1.262,6.153,0l6.499,4.386c1.518,1.024,2.424,2.729,2.424,4.559v8.614c0,3.032-2.468,5.5-5.5,5.5ZM12,2.997c-.486,0-.974,.144-1.397,.431L4.102,7.813c-.689,.466-1.102,1.24-1.102,2.072v8.614c0,1.379,1.121,2.5,2.5,2.5h13c1.379,0,2.5-1.121,2.5-2.5V9.886c0-.832-.412-1.606-1.102-2.072L13.398,3.428c-.425-.287-.912-.431-1.398-.431Z" />
						</svg>
					</div>
				</a>
				<a class="group" href="/classrooms">
					<div class="rounded-full p-4 fill-[#131313] group-aria-[current]:fill-white group-aria-[current]:bg-[#131313] transition-all ease-in-out duration-150">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							id="Layer_1"
							data-name="Layer 1"
							viewBox="0 0 24 24"
							width="22"
							height="22"
						>
							<path d="m23,18.092v-9.592c0-3.032-2.467-5.5-5.5-5.5H6.5c-3.033,0-5.5,2.468-5.5,5.5v9.592c-.581.207-1,.756-1,1.408,0,.828.671,1.5,1.5,1.5h21c.829,0,1.5-.672,1.5-1.5,0-.652-.419-1.201-1-1.408ZM6.5,6h11c1.378,0,2.5,1.121,2.5,2.5v9.5h-2v-.5c0-.828-.671-1.5-1.5-1.5h-2c-.829,0-1.5.672-1.5,1.5v.5H4v-9.5c0-1.379,1.122-2.5,2.5-2.5Z" />
						</svg>
					</div>
				</a>
			</div>
		</div>
	);
});
