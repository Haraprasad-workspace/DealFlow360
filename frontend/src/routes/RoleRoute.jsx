import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { getHomeRouteForRole } from "../constants/roles";
import useCurrentUser from "../hooks/useCurrentUser";

const RoleRoute = ({ allowedRoles = [] }) => {
	const { isLoaded, isSignedIn } = useAuth();
	const { user, loading } = useCurrentUser();

	if (!isLoaded || loading) {
		return (
			<div className="loading-state">
				<span className="loader" /> Loading workspace...
			</div>
		);
	}

	if (!isSignedIn || !user) {
		return <Navigate to="/auth" replace />;
	}

	if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
		return <Navigate to={getHomeRouteForRole(user.role)} replace />;
	}

	return <Outlet />;
};

export default RoleRoute;
