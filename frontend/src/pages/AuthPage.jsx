import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import AuthNavbar from "../components/auth/AuthNavbar";
import AuthSyncError from "../components/auth/AuthSyncError";
import AuthTabs from "../components/auth/AuthTabs";
import HelperBanner from "../components/auth/HelperBanner";
import SignInPanel from "../components/auth/SignInPanel";
import SignUpForm from "../components/auth/SignUpForm";
import { getHomeRouteForRole } from "../constants/roles";
import useCurrentUser from "../hooks/useCurrentUser";
import "../styles/auth.css";

const getSyncErrorMessage = (error) => {
	const status = error?.response?.status;
	const serverMessage = error?.response?.data?.details;

	if (status === 500 && serverMessage?.includes("Clerk")) {
		return "Backend Clerk keys are missing or invalid. Add CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY to backend/.env, then restart the server.";
	}

	if (status === 401) {
		return "Your session could not be verified. Try logging out and signing in again.";
	}

	return (
		serverMessage ||
		error?.response?.data?.error ||
		"Unable to sync your account with the server."
	);
};

const AuthPage = () => {
	const [activeTab, setActiveTab] = useState("login");
	const navigate = useNavigate();
	const { isSignedIn } = useAuth();
	const { user, loading, error, refetch } = useCurrentUser();

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

	if (isSignedIn && loading) {
		return (
			<div className="auth-loading-screen">
				Signing you in...
			</div>
		);
	}

	return (
		<div className="auth-page">
			<div className="auth-frame">
				<AuthNavbar />

				<div className="auth-content">
					<div>
						<p className="auth-eyebrow">Secure workspace access</p>
						<h2 className="auth-title">
							Login / Signup
						</h2>
						<p className="auth-subtitle">
							Entry point for internal users and customers
						</p>
					</div>

					{isSignedIn && error ? (
						<AuthSyncError
							message={getSyncErrorMessage(error)}
							onRetry={refetch}
						/>
					) : null}

					{!isSignedIn ? (
						<>
							<AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

							<div>
								{activeTab === "login" ? (
									<SignInPanel />
								) : (
									<SignUpForm onComplete={handleSignUpComplete} />
								)}
							</div>
						</>
					) : null}

					<HelperBanner />
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
