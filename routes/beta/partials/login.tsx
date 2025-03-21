import { Partial } from "fresh/runtime";
import { RouteConfig } from "fresh";
import { define } from "~/utils/server/core.ts";
import { Onboarding } from "~/islands/beta/Onboarding.tsx";

export const config: RouteConfig = {
	skipAppWrapper: true,
	skipInheritedLayouts: true,
};

export default define.page((_ctx) => {
	return (
		<>
			<Partial name="title">Welcome back!</Partial>
			<Partial name="description">Log in to your account to continue</Partial>
			<Partial name="form">
				<Onboarding loginMode />
			</Partial>
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
		</>
	);
});
