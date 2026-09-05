import apiClient from "./client";

// Keep Sales Rep API calls in one place so pages stay focused on UI state.
export const getCustomers = (params) => apiClient.get("/api/customers", { params });
export const getCustomer = (id) => apiClient.get(`/api/customers/${id}`);
export const createCustomer = (payload) => apiClient.post("/api/customers", payload);
export const updateCustomer = (id, payload) => apiClient.put(`/api/customers/${id}`, payload);

export const getProducts = (params) => apiClient.get("/api/products", { params });
export const getProduct = (id) => apiClient.get(`/api/products/${id}`);

export const getQuotations = (params) => apiClient.get("/api/quotations", { params });
export const getQuotation = (id) => apiClient.get(`/api/quotations/${id}`);
export const createQuotation = (payload) => apiClient.post("/api/quotations", payload);
export const updateQuotation = (id, payload) => apiClient.put(`/api/quotations/${id}`, payload);
export const addQuotationItem = (id, payload) => apiClient.post(`/api/quotations/${id}/items`, payload);
export const updateQuotationItem = (id, itemId, payload) => apiClient.put(`/api/quotations/${id}/items/${itemId}`, payload);
export const removeQuotationItem = (id, itemId) => apiClient.delete(`/api/quotations/${id}/items/${itemId}`);
export const submitQuotation = (id) => apiClient.post(`/api/quotations/${id}/submit`);
export const cancelQuotation = (id) => apiClient.post(`/api/quotations/${id}/cancel`);
export const getRecommendations = (id) => apiClient.get(`/api/quotations/${id}/recommendations`);

export const getOrders = (params) => apiClient.get("/api/orders", { params });
export const getOrder = (id) => apiClient.get(`/api/orders/${id}`);
export const createOrderFromQuotation = (id) => apiClient.post(`/api/orders/from-quotation/${id}`);
export const cancelOrder = (id) => apiClient.post(`/api/orders/${id}/cancel`);

export const getErrorMessage = (error) =>
	error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.details || error?.message || "Something went wrong. Please try again.";
