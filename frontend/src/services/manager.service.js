import apiClient from "../api/client";

export const getDashboard = () => apiClient.get("/api/manager/dashboard");

export const getQuotations = (params) => apiClient.get("/api/manager/quotations", { params });
export const getQuotationStats = () => apiClient.get("/api/manager/quotations/stats");
export const getQuotationById = (id) => apiClient.get(`/api/manager/quotations/${id}`);

export const getPendingApprovals = (params) => apiClient.get("/api/manager/approvals", { params });
export const getApprovalById = (id) => apiClient.get(`/api/manager/approvals/${id}`);
export const approveQuotation = (id) => apiClient.post(`/api/manager/approvals/${id}/approve`);
export const rejectQuotation = (id, reason) => apiClient.post(`/api/manager/approvals/${id}/reject`, { reason });

export const getOrders = (params) => apiClient.get("/api/manager/orders", { params });
export const getOrderStats = () => apiClient.get("/api/manager/orders/stats");
export const getOrderById = (id) => apiClient.get(`/api/manager/orders/${id}`);

export const getSalesReport = (params) => apiClient.get("/api/manager/reports/sales", { params });
export const getTeamReport = (params) => apiClient.get("/api/manager/reports/team", { params });
export const getProductReport = (params) => apiClient.get("/api/manager/reports/products", { params });

export const getErrorMessage = (error) =>
	error?.response?.data?.message ||
	error?.response?.data?.error ||
	error?.response?.data?.details ||
	error?.message ||
	"Operation failed. Please try again.";
