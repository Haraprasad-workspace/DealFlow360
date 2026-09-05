import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { getQuotationById, getErrorMessage } from "../../services/manager.service";
import ApprovalStatusBadge from "../../components/manager/ApprovalStatusBadge";
import RiskBadge from "../../components/manager/RiskBadge";
import ApprovalTimeline from "../../components/manager/ApprovalTimeline";
import { LoadingState, ErrorState } from "../../components/manager/EmptyState";

const ManagerQuotationDetails = () => {
	const { id } = useParams();
	const [quotation, setQuotation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadDetails = useCallback(() => {
		if (!id) return;
		setLoading(true);
		setError("");
		getQuotationById(id)
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
		getQuotationById(id)
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

	if (loading) return <LoadingState message="Loading quotation details..." />;
	if (error) return <ErrorState message={error} onRetry={loadDetails} />;
	if (!quotation) return <ErrorState message="Quotation not found." />;

	const items = quotation.items || [];
	const customer = quotation.customer || {};
	const salesRep = quotation.salesRep || {};

	return (
		<div>
			<Link to="/sales-manager/quotations" className="back-link">
				← Back to Team Quotations List
			</Link>

			<div className="page-header">
				<div>
					<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
						<h1 style={{ margin: 0 }}>{quotation.quotationNumber}</h1>
						<ApprovalStatusBadge status={quotation.status} />
						<RiskBadge level={quotation.riskLevel} score={quotation.riskScore} />
					</div>
					<p className="page-description">
						Manager review mode for quotation issued by{" "}
						<strong>{salesRep.name || salesRep.email || "Sales Rep"}</strong> for{" "}
						<strong>{customer.name || customer.company || "Customer"}</strong>.
					</p>
				</div>

				{quotation.status === "PENDING_APPROVAL" ? (
					<Link to={`/sales-manager/approvals/${quotation._id}`} className="button button-primary">
						Go to Approval Review →
					</Link>
				) : null}
			</div>

			<div className="detail-grid quote-detail-grid">
				<div className="stacked-panels">
					<div className="panel">
						<div className="panel-heading">
							<h2>Quotation Line Items ({items.length})</h2>
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

				<div className="stacked-panels">
					<div className="panel profile-card">
						<span className="eyebrow">Customer Account</span>
						<h2 style={{ marginTop: "6px" }}>{customer.name || "Customer Account"}</h2>
						<p>{customer.email || "No email available"}</p>
						<p>{customer.company ? `Company: ${customer.company}` : ""}</p>
						<div className="profile-meta">
							<span>Assigned Rep:</span>
							<strong>{salesRep.name || salesRep.email || "Sales Rep"}</strong>
						</div>
					</div>

					<div className="panel">
						<div className="panel-heading">
							<h2>Financial Totals</h2>
						</div>

						<div className="totals-block" style={{ marginTop: 0, paddingTop: 0 }}>
							<div className="summary-row">
								<span>Subtotal</span>
								<strong>${(quotation.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row">
								<span>Discount</span>
								<strong style={{ color: "#955347" }}>
									-${(quotation.discountTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
								</strong>
							</div>
							<div className="summary-row">
								<span>Tax</span>
								<strong>${(quotation.taxTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row grand-total">
								<span>Grand Total</span>
								<strong>${(quotation.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row" style={{ marginTop: "12px", borderTop: "2px solid #DFD9CE" }}>
								<span>Margin</span>
								<strong style={{ color: "#60816A" }}>
									{typeof quotation.margin === "number" ? `${quotation.margin.toFixed(1)}%` : quotation.margin || "0%"}
								</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManagerQuotationDetails;
