import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { setAuthTokenGetter } from "../api/client";

const AuthTokenProvider = ({ children }) => {
	const { getToken } = useAuth();

	useEffect(() => {
		setAuthTokenGetter(getToken);
	}, [getToken]);

	return children;
};

export default AuthTokenProvider;
