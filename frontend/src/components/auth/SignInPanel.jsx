import { SignIn } from "@clerk/react";
import { clerkAppearance } from "../../config/clerkAppearance";

const SignInPanel = () => (
	<div className="w-full">
		<SignIn
			routing="hash"
			appearance={clerkAppearance}
			fallbackRedirectUrl="/auth"
			forceRedirectUrl="/auth"
		/>
	</div>
);

export default SignInPanel;
