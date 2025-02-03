import { page } from "fresh";
import { define } from "~/utils/core.ts";
import { EntryForm } from "~/islands/EntryForm.tsx";

export const handler = define.handlers({
	GET(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/");
		} else {
			return page();
		}
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <EntryForm mode="signup" />;
});
