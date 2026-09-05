import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDashboard, getErrorMessage } from "../../services/manager.service";
import ManagerKpiCard from "../../components/manager/ManagerKpiCard";
import TeamPerformanceTable from "../../components/manager/TeamPerformanceTable";
import RiskBadge from "../../components/manager/RiskBadge";
import { LoadingState, ErrorState } from "../../components/manager/EmptyState";

const ManagerDashboard = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const handleRetry = useCallback(() => {
		setLoading(true);
		setError("");
		getDashboard()
			.then((res) => {
				setData(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setError(getErrorMessage(err));
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		let active = true;
		getDashboard()
			.then((res) => {
				if (active) {
					setData(res.data);
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
	}, []);

	if (loading) return <LoadingState message="Loading Sales Manager Dashboard..." />;
	if (error) return <ErrorState message={error} onRetry={handleRetry} />;

	const kpis = data?.kpis || {};
	const secondary = data?.secondaryMetrics || {};
	const teamPerformance = data?.teamPerformance || [];
	const pendingList = data?.pendingApprovalsList || data?.pendingApprovals || [];
	const recentActivity = data?.recentActivity || [];
	const highRiskDeals = data?.riskOverview?.highRiskDeals || [];

	return (
		<div>
			<div className="page-header">
				<div>
					<h1>Manager Overview</h1>
					<p className="page-description">
						Team performance, pending approvals, deal risks, and sales operations metrics.
					</p>
				</div>
				<Link to="/sales-manager/approvals" className="button button-primary">
					Review Approvals ({kpis.pendingApprovals || 0})
				</Link>
			</div>

			{/* Top KPI Cards */}
			<div className="metric-grid">
				<ManagerKpiCard
					title="Total Revenue"
					value={kpis.totalRevenue ?? 0}
					format="currency"
					subtext="Confirmed team orders"
				/>
				<ManagerKpiCard
					title="Total Orders"
					value={kpis.totalOrders ?? 0}
					subtext="Closed deals"
				/>
				<ManagerKpiCard
					title="Total Quotations"
					value={kpis.totalQuotations ?? 0}
					subtext="Created by team"
				/>
				<ManagerKpiCard
					title="Pending Approvals"
					value={kpis.pendingApprovals ?? 0}
					subtext="Requires manager review"
				/>
			</div>

			{/* Secondary Metrics Bar */}
			<div className="metric-grid" style={{ marginBottom: "24px" }}>
				<ManagerKpiCard
					title="Approved Quotes"
					value={secondary.approvedQuotations ?? 0}
					subtext="Passed validation"
				/>
				<ManagerKpiCard
					title="Rejected Quotes"
					value={secondary.rejectedQuotations ?? 0}
					subtext="Declined or high-risk"
				/>
				<ManagerKpiCard
					title="High Risk Deals"
					value={secondary.highRiskDeals ?? 0}
					subtext="Needs governance"
				/>
				<ManagerKpiCard
					title="Conversion Rate"
					value={secondary.conversionRate ?? 0}
					format="percent"
					subtext="Quote to order conversion"
				/>
			</div>

			{/* Main Grid: Pending Approvals & Team Performance */}
			<div className="dashboard-grid">
				<div className="panel">
					<div className="panel-heading">
						<h2>Pending Approvals</h2>
						<Link to="/sales-manager/approvals">View All Approvals →</Link>
					</div>

					{pendingList.length === 0 ? (
						<div className="empty-inline">No pending approvals waiting for review.</div>
					) : (
						<div className="table-panel">
							<div className="table-head" style={{ gridTemplateColumns: "1.2fr 1.2fr 0.9fr 0.9fr 0.8fr" }}>
								<div>Customer / Quote</div>
								<div>Sales Rep</div>
								<div>Amount</div>
								<div>Risk</div>
								<div>Action</div>
							</div>
							{pendingList.slice(0, 5).map((q) => {
								const qId = q._id || q.id;
								const customerName = q.customer?.name || q.customerName || "Customer";
								const repName = q.salesRep?.name || q.salesRepName || "Sales Rep";
								const amount = q.grandTotal ?? q.subtotal ?? 0;
								const riskLevel = q.riskLevel || "LOW";
								const riskScore = q.riskScore ?? 0;

								return (
									<div key={qId} className="table-row" style={{ gridTemplateColumns: "1.2fr 1.2fr 0.9fr 0.9fr 0.8fr" }}>
										<div>
											<strong>{q.quotationNumber || "Quote"}</strong>
											<small>{customerName}</small>
										</div>
										<div>
											<strong>{repName}</strong>
										</div>
										<div>
											<strong>${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
										</div>
										<div>
											<RiskBadge level={riskLevel} score={riskScore} />
										</div>
										<div>
											<Link to={`/sales-manager/approvals/${qId}`} className="button button-secondary" style={{ padding: "4px 8px", fontSize: "11px" }}>
												View
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<div className="panel">
					<div className="panel-heading">
						<h2>Team Performance</h2>
						<Link to="/sales-manager/reports">Full Team Report →</Link>
					</div>
					<TeamPerformanceTable teamMembers={teamPerformance} />
				</div>
			</div>

			{/* Bottom Grid: Recent Activity & High Risk Deals */}
			<div className="bottom-grid">
				<div className="panel">
					<div className="panel-heading">
						<h2>Recent Activity</h2>
					</div>
					{recentActivity.length === 0 ? (
						<div className="empty-inline">No recent activity logged.</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column" }}>
							{recentActivity.slice(0, 5).map((act, i) => (
								<div key={act._id || i} className="activity-row">
									<div>
										<strong>{act.action || act.description || "Activity"}</strong>
										<span>{act.details || act.entity || "Team event"}</span>
									</div>
									<div className="activity-value">
										<small>{act.createdAt ? new Date(act.createdAt).toLocaleDateString() : "Recently"}</small>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="panel">
					<div className="panel-heading">
						<h2>High Risk Deals</h2>
					</div>
					{highRiskDeals.length === 0 ? (
						<div className="empty-inline">No high-risk deals detected.</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
							{highRiskDeals.slice(0, 4).map((deal) => (
								<div key={deal._id} className="activity-row">
									<div>
										<strong>{deal.quotationNumber}</strong>
										<span>{deal.customer?.name || "Customer"}</span>
									</div>
									<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
										<RiskBadge level={deal.riskLevel || "HIGH"} score={deal.riskScore} />
										<Link to={`/sales-manager/quotations/${deal._id}`} className="accent-note" style={{ minHeight: "auto", padding: "4px 8px", fontSize: "11px" }}>
											Inspect
										</Link>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagerDashboard;
