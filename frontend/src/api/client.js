import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

let getTokenFn = null;

export const setAuthTokenGetter = (getter) => {
	getTokenFn = getter;
};

apiClient.interceptors.request.use(async (config) => {
	if (getTokenFn) {
		const token = await getTokenFn();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	return config;
});

export default apiClient;
