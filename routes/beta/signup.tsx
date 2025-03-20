import { HttpError, page, RouteConfig } from "fresh";
import { Partial } from "fresh/runtime";
import { define } from "~/utils/server/core.ts";
import { Onboarding } from "~/islands/beta/Onboarding.tsx";
import { STATUS_CODE } from "@std/http/status";
import { createUser } from "~/utils/server/user.ts";
import { createSession } from "~/utils/server/session.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/beta/classrooms");
		} else {
			return page();
		}
	},
	async POST(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/beta/classrooms");
		} else {
			const formData = await ctx.req.formData();
			const username = formData.get("username");
			const password = formData.get("password");

			if (typeof username !== "string" || typeof password !== "string") {
				throw new HttpError(STATUS_CODE.BadRequest);
			} else {
				const newUser = await createUser({ username, password });
				const newSession = await createSession(newUser.id);

				return newSession;
			}
		}
	},
});

export default define.page((_ctx) => {
	return (
		<div
			class="flex flex-col justify-center items-center min-h-full p-5 bg-gradient-to-br from-[#e8f3ff] to-white"
			f-client-nav
		>
			<img class="size-16 rounded-lg drop-shadow-md" src="/logo.png" />
			<p class="text-2xl text-gray-900 font-bold mt-4">
				<Partial name="title">Welcome to Ujian!</Partial>
			</p>
			<p class="text-slate-400 font-medium">
				<Partial name="description">Create an account to get start</Partial>
			</p>
			<Partial name="form">
				<Onboarding />
			</Partial>
			<div class="flex flex-col text-xs text-slate-700 font-medium mt-4">
				<Partial name="switch">
					<p>
						Already have an account?{" "}
						<span class="text-black font-semibold">
							<a href="/beta/login" f-partial="/beta/partials/login">Login</a>
						</span>
					</p>
				</Partial>
			</div>
		</div>
	);
});
