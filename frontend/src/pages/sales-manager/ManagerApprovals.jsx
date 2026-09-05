import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPendingApprovals, getErrorMessage } from "../../services/manager.service";
import RiskBadge from "../../components/manager/RiskBadge";
import { LoadingState, ErrorState, EmptyState } from "../../components/manager/EmptyState";

const ManagerApprovals = () => {
	const [approvals, setApprovals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [riskFilter, setRiskFilter] = useState("ALL");
	const [searchQuery, setSearchQuery] = useState("");

	const loadApprovals = useCallback(() => {
		setLoading(true);
		setError("");
		const params = {};
		if (riskFilter !== "ALL") params.riskLevel = riskFilter;

		getPendingApprovals(params)
			.then((res) => {
				const result = Array.isArray(res.data)
					? res.data
					: res.data?.quotations || res.data?.approvals || [];
				setApprovals(result);
				setLoading(false);
			})
			.catch((err) => {
				setError(getErrorMessage(err));
				setLoading(false);
			});
	}, [riskFilter]);

	useEffect(() => {
		let active = true;
		const params = {};
		if (riskFilter !== "ALL") params.riskLevel = riskFilter;

		getPendingApprovals(params)
			.then((res) => {
				if (active) {
					const result = Array.isArray(res.data)
						? res.data
						: res.data?.quotations || res.data?.approvals || [];
					setApprovals(result);
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
	}, [riskFilter]);

	const filteredApprovals = approvals.filter((item) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		const qNum = (item.quotationNumber || "").toLowerCase();
		const cust = (item.customer?.name || item.customerName || "").toLowerCase();
		const rep = (item.salesRep?.name || item.salesRepName || "").toLowerCase();
		return qNum.includes(query) || cust.includes(query) || rep.includes(query);
	});

	return (
		<div>
			<div className="page-header">
				<div>
					<h1>Approval Queue</h1>
					<p className="page-description">
						Review, evaluate risk metrics, and approve or reject team quotations.
					</p>
				</div>
			</div>

			{/* Filters Toolbar */}
			<div className="toolbar">
				<input
					type="text"
					className="search-input"
					placeholder="Search by quote #, customer, or sales rep..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
					<option value="ALL">All Risk Levels</option>
					<option value="LOW">Low Risk</option>
					<option value="MEDIUM">Medium Risk</option>
					<option value="HIGH">High Risk</option>
				</select>

				<span className="toolbar-note">
					Showing {filteredApprovals.length} pending approval requests
				</span>
			</div>

			{loading ? (
				<LoadingState message="Loading approval queue..." />
			) : error ? (
				<ErrorState message={error} onRetry={loadApprovals} />
			) : filteredApprovals.length === 0 ? (
				<EmptyState
					title="No pending approvals"
					description="There are currently no quotations waiting for manager approval."
				/>
			) : (
				<div className="table-panel">
					<div className="table-head" style={{ gridTemplateColumns: "1.2fr 1.3fr 1.1fr 1fr 0.9fr 0.9fr 1fr 0.7fr" }}>
						<div>Quotation #</div>
						<div>Customer</div>
						<div>Sales Rep</div>
						<div>Amount</div>
						<div>Discount</div>
						<div>Margin</div>
						<div>Risk Level</div>
						<div>Action</div>
					</div>

					{filteredApprovals.map((item) => {
						const id = item._id || item.id;
						const qNum = item.quotationNumber || "—";
						const customerName = item.customer?.name || item.customerName || "Customer";
						const repName = item.salesRep?.name || item.salesRepName || "Sales Rep";
						const amount = item.grandTotal ?? item.subtotal ?? 0;
						const discount = item.discountTotal ?? 0;
						const margin = item.margin ?? item.marginPercent ?? 0;
						const riskLevel = item.riskLevel || "LOW";
						const riskScore = item.riskScore ?? 0;

						return (
							<div
								key={id}
								className="table-row"
								style={{ gridTemplateColumns: "1.2fr 1.3fr 1.1fr 1fr 0.9fr 0.9fr 1fr 0.7fr" }}
							>
								<div>
									<strong>{qNum}</strong>
									<small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</small>
								</div>
								<div>
									<strong>{customerName}</strong>
									<small>{item.customer?.tier || "Standard"}</small>
								</div>
								<div>
									<strong>{repName}</strong>
								</div>
								<div>
									<strong>${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
								</div>
								<div>
									<strong>${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
								</div>
								<div>
									<strong>{typeof margin === "number" ? `${margin.toFixed(1)}%` : margin}</strong>
								</div>
								<div>
									<RiskBadge level={riskLevel} score={riskScore} />
								</div>
								<div>
									<Link
										to={`/sales-manager/approvals/${id}`}
										className="button button-primary"
										style={{ padding: "5px 10px", fontSize: "11px" }}
									>
										View
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ManagerApprovals;
