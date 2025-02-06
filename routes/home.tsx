import { page } from "fresh";
import { define } from "~/utils/server/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		ctx.state.title = "Home";
		return page({ toDo: [] });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { toDo } = data;

	return (
		<div class="flex flex-col">
			<div class="flex flex-col gap-2">
				<p class="text-xl font-bold">To do</p>
				<div class="flex">
					{toDo.length === 0
						? (
							<p class="text-sm font-semibold">
								Looks like you've done everything, Good Job.
							</p>
						)
						: <p>Coming soon</p>}
				</div>
			</div>
		</div>
	);
});
