import { useEffect, useState } from "react";
import apiClient from "../../api/client";

const FinanceApprovals = () => {
	const [items, setItems] = useState([]);
	const [error, setError] = useState("");
	const load = () => apiClient.get("/api/finance/approvals").then(({ data }) => setItems(data)).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load Finance approvals."));
	useEffect(() => { load(); }, []);
	const decide = async (id, action) => {
		try {
			await apiClient.post(`/api/finance/approvals/${id}/${action}`, action === "reject" ? { reason: "Finance approval declined" } : undefined);
			load();
		} catch (requestError) {
			setError(requestError.response?.data?.message || "Unable to process approval.");
		}
	};
	return <div><div className="page-header"><div><p className="eyebrow">Finance governance</p><h1>Finance approvals</h1><p className="page-description">Review quotations that completed Manager approval and require Finance sign-off.</p></div></div>{error ? <div className="error-state">{error}</div> : null}{!items.length && !error ? <div className="empty-state"><div className="empty-icon">✓</div><h3>No Finance approvals pending</h3><p>High-risk quotations will appear here after Manager approval.</p></div> : <div className="table-panel"><div className="table-head"><div>Quotation</div><div>Customer</div><div>Amount</div><div>Risk</div><div>Action</div></div>{items.map((item) => <div className="table-row" key={item._id}><div><strong>{item.quotationNumber}</strong><small>{new Date(item.createdAt).toLocaleDateString()}</small></div><div>{item.customer?.name || "Customer"}</div><div>₹{Number(item.grandTotal || 0).toLocaleString("en-IN")}</div><div><span className="status-pill status-high">{item.blendedRisk || "HIGH"}</span></div><div><button className="button button-primary" onClick={() => decide(item._id, "approve")}>Approve</button><button className="button button-secondary" onClick={() => decide(item._id, "reject")}>Reject</button></div></div>)}</div>}</div>;
};

export default FinanceApprovals;
