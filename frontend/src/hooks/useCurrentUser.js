import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import apiClient from "../api/client";

const useCurrentUser = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUser = useCallback(async () => {
		if (!isSignedIn) {
			setUser(null);
			setLoading(false);
			setError(null);
			return null;
		}

		try {
			setLoading(true);
			setError(null);
			const { data } = await apiClient.get("/api/me");
			setUser(data);
			return data;
		} catch (fetchError) {
			setUser(null);
			setError(fetchError);
			return null;
		} finally {
			setLoading(false);
		}
	}, [isSignedIn]);

	useEffect(() => {
		if (!isLoaded) {
			return;
		}

		const timer = window.setTimeout(fetchUser, 0);
		return () => window.clearTimeout(timer);
	}, [isLoaded, fetchUser]);

	return {
		user,
		loading: !isLoaded || loading,
		error,
		refetch: fetchUser,
	};
};

export default useCurrentUser;
