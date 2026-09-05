import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById, getErrorMessage } from "../../services/manager.service";
import ApprovalStatusBadge from "../../components/manager/ApprovalStatusBadge";
import { LoadingState, ErrorState } from "../../components/manager/EmptyState";

const ManagerOrderDetails = () => {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadOrder = useCallback(() => {
		if (!id) return;
		setLoading(true);
		setError("");
		getOrderById(id)
			.then((res) => {
				setOrder(res.data);
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
		getOrderById(id)
			.then((res) => {
				if (active) {
					setOrder(res.data);
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

	if (loading) return <LoadingState message="Loading order details..." />;
	if (error) return <ErrorState message={error} onRetry={loadOrder} />;
	if (!order) return <ErrorState message="Order not found." />;

	const items = order.items || [];
	const customer = order.customer || {};
	const salesRep = order.salesRep || {};
	const quotation = order.quotation || {};

	return (
		<div>
			<Link to="/sales-manager/orders" className="back-link">
				← Back to Team Orders List
			</Link>

			<div className="page-header">
				<div>
					<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
						<h1 style={{ margin: 0 }}>{order.orderNumber}</h1>
						<ApprovalStatusBadge status={order.status} />
					</div>
					<p className="page-description">
						Confirmed order converted from Quotation{" "}
						{quotation._id || quotation.quotationNumber ? (
							<Link to={`/sales-manager/quotations/${quotation._id || quotation}`} style={{ color: "#BB6B43" }}>
								{quotation.quotationNumber || "Ref Quote"}
							</Link>
						) : (
							"Ref Quote"
						)}{" "}
						on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}.
					</p>
				</div>
			</div>

			<div className="detail-grid quote-detail-grid">
				<div className="stacked-panels">
					<div className="panel">
						<div className="panel-heading">
							<h2>Order Items ({items.length})</h2>
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
				</div>

				<div className="stacked-panels">
					<div className="panel profile-card">
						<span className="eyebrow">Customer Account</span>
						<h2 style={{ marginTop: "6px" }}>{customer.name || "Customer Account"}</h2>
						<p>{customer.email || "No email available"}</p>
						<p>{customer.company ? `Company: ${customer.company}` : ""}</p>
						<div className="profile-meta">
							<span>Responsible Rep:</span>
							<strong>{salesRep.name || salesRep.email || "Sales Rep"}</strong>
						</div>
					</div>

					<div className="panel">
						<div className="panel-heading">
							<h2>Order Financial Summary</h2>
						</div>

						<div className="totals-block" style={{ marginTop: 0, paddingTop: 0 }}>
							<div className="summary-row">
								<span>Subtotal</span>
								<strong>${(order.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row">
								<span>Discounts Applied</span>
								<strong style={{ color: "#955347" }}>
									-${(order.discountTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
								</strong>
							</div>
							<div className="summary-row">
								<span>Tax Amount</span>
								<strong>${(order.taxTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
							<div className="summary-row grand-total">
								<span>Grand Total</span>
								<strong>${(order.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManagerOrderDetails;
