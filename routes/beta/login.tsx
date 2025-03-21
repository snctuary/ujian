import { Partial } from "fresh/runtime";
import { HttpError, page, RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { Onboarding } from "~/islands/beta/Onboarding.tsx";
import { STATUS_CODE } from "@std/http/status";
import { retrievePassword, searchUser } from "~/utils/server/user.ts";
import { verify } from "@bronti/bcrypt";
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
				const userId = await searchUser(username);

				if (userId) {
					const hashedPassword = await retrievePassword(userId);

					if (!hashedPassword) {
						return page();
					} else {
						const valid = await verify(password, hashedPassword);

						if (!valid) {
							return page();
						} else {
							return await createSession(userId);
						}
					}
				} else {
					return page();
				}
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
				<Partial name="title">Welcome back!</Partial>
			</p>
			<p class="text-slate-400 font-medium">
				<Partial name="description">Log in to your account to continue</Partial>
			</p>
			<Partial name="form">
				<Onboarding loginMode />
			</Partial>
			<div class="flex flex-col text-xs text-slate-700 font-medium mt-4">
				<Partial name="switch">
					<p>
						Didn't have an account?{" "}
						<span class="text-black font-semibold">
							<a href="/beta/signup" f-partial="/beta/partials/signup">
								Sign Up
							</a>
						</span>
					</p>
				</Partial>
			</div>
		</div>
	);
});
