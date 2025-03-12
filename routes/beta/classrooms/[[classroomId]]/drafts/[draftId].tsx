import { HttpError, page, RouteConfig } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/server/core.ts";
import { fetchDraft } from "~/utils/server/tests.ts";
import { DraftEditor } from "~/islands/beta/DraftEditor.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const { draftId } = ctx.params;
		const classroomId = ctx.state.currentClassroomId!;

		const draft = await fetchDraft(
			classroomId,
			ctx.state.currentClassroomMember!.userId,
			draftId,
		);

		if (!draft) {
			throw new HttpError(STATUS_CODE.NotFound);
		} else {
			return page({ draft });
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	return <DraftEditor draft={data.draft} />;
});
