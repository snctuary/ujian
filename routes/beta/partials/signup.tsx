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
			<Partial name="title">Welcome to Ujian!</Partial>
			<Partial name="description">Create an account to get start</Partial>
			<Partial name="form">
				<Onboarding />
			</Partial>
			<Partial name="switch">
				<p>
					Already have an account?{" "}
					<span class="text-black font-semibold">
						<a href="/beta/login" f-partial="/beta/partials/login">Login</a>
					</span>
				</p>
			</Partial>
		</>
	);
});
