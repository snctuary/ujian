import { Partial } from "fresh/runtime";
import { define } from "~/utils/server/core.ts";

export default define.page((_ctx) => {
	return (
		<Partial name="content">
			<p>overview</p>
		</Partial>
	);
});
