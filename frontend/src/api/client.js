import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

let getTokenFn = null;

export const setAuthTokenGetter = (getter) => {
	getTokenFn = getter;
};

apiClient.interceptors.request.use(async (config) => {
	const requestId = `${config.method?.toUpperCase() || "GET"} ${config.url}`;
	config.metadata = { startedAt: Date.now(), requestId };
	console.info(`[api] start ${requestId}`, config.params || "");
	try {
		if (getTokenFn) {
			const token = await getTokenFn();
			if (token) config.headers.Authorization = `Bearer ${token}`;
			console.info(`[api] auth token attached ${requestId}`);
		} else {
			console.warn(`[api] auth token getter is not ready ${requestId}`);
		}
	} catch (error) {
		console.error(`[api] auth token failed ${requestId}`, error);
		throw error;
	}

	return config;
});

apiClient.interceptors.response.use(
	(response) => {
		const requestId = response.config.metadata?.requestId || response.config.url;
		console.info(`[api] success ${response.status} ${requestId} (${Date.now() - response.config.metadata?.startedAt}ms)`);
		return response;
	},
	(error) => {
		const requestId = error.config?.metadata?.requestId || error.config?.url || "unknown request";
		console.error(`[api] failed ${error.response?.status || "network"} ${requestId}`, error.response?.data || error.message);
		return Promise.reject(error);
	},
);

export default apiClient;
