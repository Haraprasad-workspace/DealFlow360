import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
	getApprovalById,
	approveQuotation,
	rejectQuotation,
	getErrorMessage,
} from "../../services/manager.service";
import ApprovalStatusBadge from "../../components/manager/ApprovalStatusBadge";
import RiskBadge from "../../components/manager/RiskBadge";
import ApprovalTimeline from "../../components/manager/ApprovalTimeline";
import RejectionModal from "../../components/manager/RejectionModal";
import { LoadingState, ErrorState } from "../../components/manager/EmptyState";

const ManagerApprovalDetails = () => {
	const { id } = useParams();

	const [quotation, setQuotation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionMessage, setActionMessage] = useState({ type: "", text: "" });
	const [actionSubmitting, setActionSubmitting] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);

	const loadQuotation = useCallback(() => {
		if (!id) return;
		setLoading(true);
		setError("");
		getApprovalById(id)
			.then((res) => {
				setQuotation(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setError(getErrorMessage(err));
				setLoading(false);
			});
	}, [id]);

	useEffect(() => {
		if (!id) return;
		let active = true;
		getApprovalById(id)
			.then((res) => {
				if (active) {
					setQuotation(res.data);
					setLoading(false);
				}
			})
			.catch((err) => {
				if (active) {
					setError(getErrorMessage(err));
					setLoading(false);
				}
			});

		return () => {
			active = false;
		};
	}, [id]);

	const handleApprove = async () => {
		try {
			setActionSubmitting(true);
			setActionMessage({ type: "", text: "" });
			const response = await approveQuotation(id);
			setActionMessage({ type: "success", text: response.data?.message || "Quotation approved successfully." });
			loadQuotation();
		} catch (err) {
			setActionMessage({ type: "error", text: getErrorMessage(err) });
		} finally {
			setActionSubmitting(false);
		}
	};

	const handleRejectSubmit = async (reason) => {
		try {
			setActionSubmitting(true);
			setActionMessage({ type: "", text: "" });
			const response = await rejectQuotation(id, reason);
			setShowRejectModal(false);
			setActionMessage({ type: "success", text: response.data?.message || "Quotation rejected successfully." });
			loadQuotation();
		} catch (err) {
			setActionMessage({ type: "error", text: getErrorMessage(err) });
		} finally {
			setActionSubmitting(false);
		}
	};

	if (loading) return <LoadingState message="Loading quotation approval details..." />;
	if (error) return <ErrorState message={error} onRetry={loadQuotation} />;
	if (!quotation) return <ErrorState message="Quotation not found." />;

	const items = quotation.items || [];
	const customer = quotation.customer || {};
	const salesRep = quotation.salesRep || {};
	const canTakeAction = quotation.status === "PENDING_APPROVAL";

	return (
		<div>
			<Link to="/sales-manager/approvals" className="back-link">
				← Back to Approvals List
			</Link>

			<div className="page-header">
				<div>
					<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
						<h1 style={{ margin: 0 }}>{quotation.quotationNumber}</h1>
						<ApprovalStatusBadge status={quotation.status} />
						<RiskBadge level={quotation.riskLevel} score={quotation.riskScore} />
					</div>
					<p className="page-description">
						Submitted by <strong>{salesRep.name || salesRep.email || "Sales Rep"}</strong> for{" "}
						<strong>{customer.name || customer.company || "Customer"}</strong> on{" "}
						{quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : "—"}.
					</p>
				</div>

				{canTakeAction ? (
					<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
						<button
							type="button"
							className="button"
							style={{ background: "#955347", color: "#FFFDF8" }}
							onClick={() => setShowRejectModal(true)}
							disabled={actionSubmitting}
						>
							Reject Quotation
						</button>
						<button
							type="button"
							className="button button-primary"
							onClick={handleApprove}
							disabled={actionSubmitting}
						>
							{actionSubmitting ? "Approving..." : "Approve Quotation"}
						</button>
					</div>
				) : null}
			</div>

			{actionMessage.text ? (
				<div
					className={actionMessage.type === "error" ? "error-state" : "accent-note"}
					style={{ minHeight: "auto", padding: "14px", marginBottom: "20px" }}
				>
					<strong>{actionMessage.type === "error" ? "Action Failed:" : "Status Update:"}</strong>{" "}
					{actionMessage.text}
				</div>
			) : null}

			<div className="detail-grid quote-detail-grid">
				{/* Left Column: Products & Totals */}
				<div className="stacked-panels">
					<div className="panel">
						<div className="panel-heading">
							<h2>Quotation Items ({items.length})</h2>
							<span className="eyebrow">Line Breakdown</span>
						</div>

						<div className="table-panel">
							<div className="table-head" style={{ gridTemplateColumns: "2fr 0.8fr 1fr 1fr 1fr 1fr" }}>
								<div>Product</div>
								<div>Qty</div>
								<div>Unit Price</div>
								<div>Discount</div>
								<div>Tax</div>
								<div>Total</div>
							</div>

							{items.map((item, idx) => {
								const productName = item.product?.name || item.name || `Item ${idx + 1}`;
								const qty = item.quantity || 1;
								const unitPrice = item.unitPrice || item.price || 0;
								const discountVal = item.discount || item.discountTotal || 0;
								const taxVal = item.tax || item.taxTotal || 0;
								const totalVal = item.total || item.lineTotal || qty * unitPrice - discountVal + taxVal;

								return (
									<div
										key={item._id || idx}
										className="table-row"
										style={{ gridTemplateColumns: "2fr 0.8fr 1fr 1fr 1fr 1fr" }}
									>
										<div>
											<strong>{productName}</strong>
											{item.product?.category ? <small>{item.product.category}</small> : null}
										</div>
										<div>
											<strong>{qty}</strong>
										</div>
										<div>
											<strong>${unitPrice.toFixed(2)}</strong>
										</div>
										<div>
											<strong>${discountVal.toFixed(2)}</strong>
										</div>
										<div>
											<strong>${taxVal.toFixed(2)}</strong>
										</div>
										<div>
											<strong>${totalVal.toFixed(2)}</strong>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<ApprovalTimeline quotation={quotation} />
				</div>

				{/* Right Column: Customer Info, Risk & Financial Summary */}
				<div className="stacked-panels">
					<div className="panel profile-card">
						<span className="eyebrow">Customer Information</span>
						<h2 style={{ marginTop: "6px" }}>{customer.name || "Customer Account"}</h2>
						<p>{customer.email || "No email available"}</p>
						<p>{customer.company ? `Company: ${customer.company}` : ""}</p>
						<div className="profile-meta">
							<span>Customer Tier:</span>
							<strong className={`tier tier-${(customer.tier || "bronze").toLowerCase()}`}>
								{customer.tier || "Bronze"}
							</strong>
						</div>
					</div>

					<div className="panel">
						<div className="panel-heading">
							<h2>Financial Summary</h2>
						</div>

						<div className="totals-block" style={{ marginTop: 0, paddingTop: 0 }}>
							<div className="summary-row">
								<span>Subtotal</span>
								<strong>${(quotation.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row">
								<span>Discount Total</span>
								<strong style={{ color: "#955347" }}>
									-${(quotation.discountTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
								</strong>
							</div>
							<div className="summary-row">
								<span>Tax Total</span>
								<strong>${(quotation.taxTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row grand-total">
								<span>Grand Total</span>
								<strong>${(quotation.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row" style={{ marginTop: "12px", borderTop: "2px solid #DFD9CE" }}>
								<span>Profit Margin</span>
								<strong style={{ color: "#60816A" }}>
									{typeof quotation.margin === "number" ? `${quotation.margin.toFixed(1)}%` : quotation.margin || "0%"}
								</strong>
							</div>
						</div>
					</div>

					<div className="panel">
						<div className="panel-heading">
							<h2>Risk Assessment</h2>
						</div>
						<div className="risk-score">
							<strong>{quotation.riskScore ?? 0}</strong>
							<span>/ 100 Risk Index</span>
						</div>
						<RiskBadge level={quotation.riskLevel || "LOW"} />
						<p style={{ marginTop: "12px", fontSize: "12px", color: "#737A72" }}>
							{quotation.riskScore > 50
								? "Warning: High discount percentage or low profit margin detected."
								: "Discount levels and profit margins fall within standard operational guidelines."}
						</p>
					</div>
				</div>
			</div>

			{showRejectModal ? (
				<RejectionModal
					quotationNumber={quotation.quotationNumber}
					onSubmit={handleRejectSubmit}
					onClose={() => setShowRejectModal(false)}
					submitting={actionSubmitting}
				/>
			) : null}
		</div>
	);
};

export default ManagerApprovalDetails;
