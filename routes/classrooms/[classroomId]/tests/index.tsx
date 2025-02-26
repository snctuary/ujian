import { Partial } from "fresh/runtime";
import { define } from "~/utils/server/core.ts";

export default define.page((ctx) => {
	const _classroom = ctx.state.classroom!;

	return (
		<Partial name="content">
			<p>coming soon</p>
		</Partial>
	);
});
