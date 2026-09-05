import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import AuthNavbar from "../components/auth/AuthNavbar";
import AuthTabs from "../components/auth/AuthTabs";
import HelperBanner from "../components/auth/HelperBanner";
import SignInPanel from "../components/auth/SignInPanel";
import SignUpForm from "../components/auth/SignUpForm";
import { getHomeRouteForRole } from "../constants/roles";
import useCurrentUser from "../hooks/useCurrentUser";

const AuthPage = () => {
	const [activeTab, setActiveTab] = useState("login");
	const navigate = useNavigate();
	const { isSignedIn } = useAuth();
	const { user, loading, refetch } = useCurrentUser();

	useEffect(() => {
		if (isSignedIn && user && !loading) {
			navigate(getHomeRouteForRole(user.role), { replace: true });
		}
	}, [isSignedIn, user, loading, navigate]);

	const handleSignUpComplete = async () => {
		const syncedUser = await refetch();

		if (syncedUser) {
			navigate(getHomeRouteForRole(syncedUser.role), { replace: true });
		}
	};

	return (
		<div className="min-h-screen bg-[#FAFAFC] px-4 py-10 font-['Inter',sans-serif] text-[#1A1B25]">
			<div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(30,26,80,0.04),0_2px_8px_rgba(30,26,80,0.06)]">
				<AuthNavbar />

				<div className="space-y-6 px-6 py-8">
					<div>
						<h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold">
							Login / Signup
						</h2>
						<p className="mt-1 text-sm text-[#5C5D6E]">
							Entry point for internal users and customers
						</p>
					</div>

					<AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

					<div>
						{activeTab === "login" ? (
							<SignInPanel />
						) : (
							<SignUpForm onComplete={handleSignUpComplete} />
						)}
					</div>

					<HelperBanner />
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
