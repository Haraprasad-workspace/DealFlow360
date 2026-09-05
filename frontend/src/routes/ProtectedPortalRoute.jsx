import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { USER_ROLES, getHomeRouteForRole } from "../constants/roles";
import useCurrentUser from "../hooks/useCurrentUser";

const ProtectedPortalRoute = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const { user, loading } = useCurrentUser();

	if (!isLoaded || loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#FAFAFC] text-sm text-[#5C5D6E]">
				Loading portal...
			</div>
		);
	}

	if (!isSignedIn) {
		return <Navigate to="/auth" replace />;
	}

	if (!user) {
		return <Navigate to="/auth" replace />;
	}

	if (user.role !== USER_ROLES.CUSTOMER) {
		return <Navigate to={getHomeRouteForRole(user.role)} replace />;
	}

	return <Outlet />;
};

export default ProtectedPortalRoute;
