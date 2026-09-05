import { useEffect, useState, useCallback } from "react";
import {
	getSalesReport,
	getTeamReport,
	getProductReport,
	getErrorMessage,
} from "../../services/manager.service";
import ManagerKpiCard from "../../components/manager/ManagerKpiCard";
import TeamPerformanceTable from "../../components/manager/TeamPerformanceTable";
import { LoadingState, ErrorState, EmptyState } from "../../components/manager/EmptyState";

const ManagerReports = () => {
	const [activeTab, setActiveTab] = useState("sales");
	const [period, setPeriod] = useState("month");

	const [salesData, setSalesData] = useState(null);
	const [teamData, setTeamData] = useState([]);
	const [productData, setProductData] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadReports = useCallback(() => {
		setLoading(true);
		setError("");
		const params = { period };

		const req =
			activeTab === "sales"
				? getSalesReport(params)
				: activeTab === "team"
				? getTeamReport(params)
				: getProductReport(params);

		req
			.then((res) => {
				if (activeTab === "sales") {
					setSalesData(res.data);
				} else if (activeTab === "team") {
					setTeamData(Array.isArray(res.data) ? res.data : res.data?.team || []);
				} else {
					setProductData(Array.isArray(res.data) ? res.data : res.data?.products || []);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(getErrorMessage(err));
				setLoading(false);
			});
	}, [activeTab, period]);

	useEffect(() => {
		let active = true;
		const params = { period };

		const req =
			activeTab === "sales"
				? getSalesReport(params)
				: activeTab === "team"
				? getTeamReport(params)
				: getProductReport(params);

		req
			.then((res) => {
				if (!active) return;
				if (activeTab === "sales") {
					setSalesData(res.data);
				} else if (activeTab === "team") {
					setTeamData(Array.isArray(res.data) ? res.data : res.data?.team || []);
				} else {
					setProductData(Array.isArray(res.data) ? res.data : res.data?.products || []);
				}
				setLoading(false);
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
	}, [activeTab, period]);

	return (
		<div>
			<div className="page-header">
				<div>
					<h1>Sales & Team Reports</h1>
					<p className="page-description">
						Analytical breakdown of sales performance, team conversion rates, and product revenue.
					</p>
				</div>
			</div>

			{/* Filters & Tabs Bar */}
			<div className="toolbar" style={{ marginBottom: "24px" }}>
				<div style={{ display: "flex", gap: "6px" }}>
					<button
						type="button"
						className={`button ${activeTab === "sales" ? "button-primary" : "button-secondary"}`}
						onClick={() => setActiveTab("sales")}
						style={{ padding: "8px 14px" }}
					>
						Sales Performance
					</button>
					<button
						type="button"
						className={`button ${activeTab === "team" ? "button-primary" : "button-secondary"}`}
						onClick={() => setActiveTab("team")}
						style={{ padding: "8px 14px" }}
					>
						Team Performance
					</button>
					<button
						type="button"
						className={`button ${activeTab === "products" ? "button-primary" : "button-secondary"}`}
						onClick={() => setActiveTab("products")}
						style={{ padding: "8px 14px" }}
					>
						Product Performance
					</button>
				</div>

				<div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
					<span style={{ fontSize: "12px", color: "#737A72" }}>Time Horizon:</span>
					<select value={period} onChange={(e) => setPeriod(e.target.value)}>
						<option value="today">Today</option>
						<option value="week">This Week</option>
						<option value="month">This Month</option>
						<option value="all">All Time</option>
					</select>
				</div>
			</div>

			{loading ? (
				<LoadingState message="Generating report analytics..." />
			) : error ? (
				<ErrorState message={error} onRetry={loadReports} />
			) : activeTab === "sales" ? (
				<div>
					<div className="metric-grid">
						<ManagerKpiCard
							title="Total Revenue"
							value={salesData?.revenue ?? salesData?.totalRevenue ?? 0}
							format="currency"
							subtext="Gross team revenue"
						/>
						<ManagerKpiCard
							title="Total Orders"
							value={salesData?.orders ?? salesData?.totalOrders ?? 0}
							subtext="Completed sales deals"
						/>
						<ManagerKpiCard
							title="Total Quotations"
							value={salesData?.quotations ?? salesData?.totalQuotations ?? 0}
							subtext="Quotes generated"
						/>
						<ManagerKpiCard
							title="Conversion Rate"
							value={salesData?.conversionRate ?? salesData?.conversion ?? 0}
							format="percent"
							subtext="Quotes converted to orders"
						/>
					</div>

					<div className="panel" style={{ marginTop: "20px" }}>
						<div className="panel-heading">
							<h2>Executive Summary</h2>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
							<div className="summary-row">
								<span>Average Deal Value</span>
								<strong>
									${(salesData?.avgDealValue ?? salesData?.averageDealValue ?? 0).toLocaleString(undefined, {
										minimumFractionDigits: 2,
									})}
								</strong>
							</div>
							<div className="summary-row">
								<span>Approved Quote Value</span>
								<strong>
									${(salesData?.approvedValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
								</strong>
							</div>
						</div>
					</div>
				</div>
			) : activeTab === "team" ? (
				<div className="panel">
					<div className="panel-heading">
						<h2>Sales Representative Performance Breakdown</h2>
					</div>
					<TeamPerformanceTable teamMembers={teamData} />
				</div>
			) : (
				<div className="panel">
					<div className="panel-heading">
						<h2>Product Performance Breakdown</h2>
					</div>
					{productData.length === 0 ? (
						<EmptyState
							title="No product sales data"
							description="No products sold within the selected timeframe."
						/>
					) : (
						<div className="table-panel">
							<div className="table-head" style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1.2fr 1fr" }}>
								<div>Product Name</div>
								<div>Category</div>
								<div>Units Sold</div>
								<div>Total Revenue</div>
								<div>Orders Count</div>
							</div>
							{productData.map((prod, idx) => {
								const name = prod.productName || prod.name || prod.product?.name || `Product ${idx + 1}`;
								const category = prod.category || prod.product?.category || "General";
								const units = prod.unitsSold ?? prod.quantity ?? 0;
								const rev = prod.revenue ?? prod.totalRevenue ?? 0;
								const ordersCount = prod.orderCount ?? prod.orders ?? 0;

								return (
									<div
										key={prod._id || idx}
										className="table-row"
										style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1.2fr 1fr" }}
									>
										<div>
											<strong>{name}</strong>
										</div>
										<div>
											<strong>{category}</strong>
										</div>
										<div>
											<strong>{units}</strong>
										</div>
										<div>
											<strong>${rev.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
										</div>
										<div>
											<strong>{ordersCount}</strong>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ManagerReports;
