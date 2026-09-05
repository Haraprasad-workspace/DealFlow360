import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCustomers, getOrders, getProducts, getQuotations, getErrorMessage } from "../api/salesRep";
import { LoadingState, ErrorState, Money, PageHeader, StatusPill } from "../components/WorkspaceUI";

const Dashboard = () => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const loadData = useCallback(() => {
		setLoading(true);
		setError(null);
		Promise.all([
			getCustomers({ limit: 1 }),
			getProducts({ limit: 1 }),
			getQuotations({ limit: 100 }),
			getOrders({ limit: 100 }),
		])
			.then(([customers, products, quotes, orders]) => {
				setData({
					customers: customers.data,
					products: products.data,
					quotes: quotes.data,
					orders: orders.data,
				});
				setLoading(false);
			})
			.catch((err) => {
				setError(err);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		let active = true;
		Promise.all([
			getCustomers({ limit: 1 }),
			getProducts({ limit: 1 }),
			getQuotations({ limit: 100 }),
			getOrders({ limit: 100 }),
		])
			.then(([customers, products, quotes, orders]) => {
				if (active) {
					setData({
						customers: customers.data,
						products: products.data,
						quotes: quotes.data,
						orders: orders.data,
					});
					setLoading(false);
				}
			})
			.catch((err) => {
				if (active) {
					setError(err);
					setLoading(false);
				}
			});
		return () => {
			active = false;
		};
	}, []);

	// Live 7-Day Activity Calculator from DB records
	const weeklyActivity = useMemo(() => {
		if (!data) return [];
		const quotesList = data.quotes?.quotations || [];
		const ordersList = data.orders?.orders || [];
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		const days = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const dayNum = String(d.getDate()).padStart(2, "0");
			const dateKey = `${year}-${month}-${dayNum}`;
			days.push({
				key: dateKey,
				label: dayNames[d.getDay()],
				count: 0,
			});
		}

		[...quotesList, ...ordersList].forEach((item) => {
			if (item.createdAt) {
				const itemDate = new Date(item.createdAt);
				const year = itemDate.getFullYear();
				const month = String(itemDate.getMonth() + 1).padStart(2, "0");
				const dayNum = String(itemDate.getDate()).padStart(2, "0");
				const itemKey = `${year}-${month}-${dayNum}`;
				const target = days.find((d) => d.key === itemKey);
				if (target) target.count += 1;
			}
		});

		const maxCount = Math.max(1, ...days.map((d) => d.count));
		return days.map((d) => ({
			...d,
			height: Math.max(15, Math.round((d.count / maxCount) * 100)),
		}));
	}, [data]);

	if (loading) return <LoadingState label="Loading sales workspace..." />;
	if (error && !data) return <ErrorState error={getErrorMessage(error)} onRetry={loadData} />;
	if (!data) return <LoadingState />;

	const quotes = data.quotes?.quotations || [];
	const orders = data.orders?.orders || [];
	const customerCount = data.customers?.total ?? 0;
	const revenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
	const pending = quotes.filter((quote) => quote.status === "PENDING_APPROVAL").length;
	const currentDateLabel = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<>
			<PageHeader
				eyebrow={currentDateLabel}
				title="Sales Command Center"
				description="Real-time operational view of your deals, customers, and approval workflows."
				action={
					<Link className="button button-primary" to="/sales-rep/quotations/new">
						+ New quotation
					</Link>
				}
			/>

			{/* KPI Metrics */}
			<div className="metric-grid">
				{[
					["Active Customers", customerCount, "Relationship base"],
					["Open Quotations", quotes.length, `${pending} pending approval`],
					["Orders Booked", orders.length, "Confirmed deals"],
					["Booked Revenue", <Money key="rev" value={revenue} />, "Approved orders"],
				].map(([label, value, note]) => (
					<div className="metric-card" key={label}>
						<span>{label}</span>
						<strong>{value}</strong>
						<small>{note}</small>
					</div>
				))}
			</div>

			{/* Main Grid: Live Pipeline Activity & Approval Queue */}
			<div className="dashboard-grid">
				<section className="panel panel-large">
					<div className="panel-heading">
						<div>
							<p className="eyebrow">Pipeline Pulse</p>
							<h2>7-Day Activity Volume</h2>
						</div>
						<Link to="/sales-rep/quotations">View all ↗</Link>
					</div>

					<div className="bar-chart">
						{weeklyActivity.map((day) => (
							<div className="bar-column" key={day.key}>
								<div className="bar" style={{ height: `${day.height}%` }} />
								<small>{day.label}</small>
							</div>
						))}
					</div>
				</section>

				<section className="panel">
					<div className="panel-heading">
						<div>
							<p className="eyebrow">Needs Attention</p>
							<h2>Approval Queue</h2>
						</div>
					</div>

					{quotes
						.filter((quote) => quote.status === "PENDING_APPROVAL")
						.slice(0, 4)
						.map((quote) => (
							<Link className="activity-row" to={`/sales-rep/quotations/${quote._id}`} key={quote._id}>
								<div>
									<strong>{quote.quotationNumber}</strong>
									<span>{quote.customer?.name || quote.customer?.company || "Customer"}</span>
								</div>
								<StatusPill status={quote.status} />
							</Link>
						))}

					{!pending && <p className="muted-copy">No quotations currently waiting for approval.</p>}
				</section>
			</div>

			{/* Bottom Grid: Recent Orders & Strategy Note */}
			<div className="bottom-grid">
				<section className="panel">
					<div className="panel-heading">
						<div>
							<p className="eyebrow">Latest Movement</p>
							<h2>Recent Orders</h2>
						</div>
						<Link to="/sales-rep/orders">View all ↗</Link>
					</div>

					{orders.slice(0, 4).map((order) => (
						<Link className="activity-row" to={`/sales-rep/orders/${order._id}`} key={order._id}>
							<div>
								<strong>{order.orderNumber}</strong>
								<span>{order.customer?.name || order.customer?.company || "Customer"}</span>
							</div>
							<div className="activity-value">
								<Money value={order.grandTotal} />
								<StatusPill status={order.status} />
							</div>
						</Link>
					))}

					{!orders.length && (
						<p className="muted-copy">Orders will appear here once quotations are approved.</p>
					)}
				</section>

				<section className="accent-note">
					<p className="eyebrow">Sales Governance</p>
					<h2>Momentum is a Habit.</h2>
					<p>
						Keep every quote moving forward. Follow up on pending approvals and maintain healthy gross margins across all deals.
					</p>
					<Link to="/sales-rep/customers">Review customer book ↗</Link>
				</section>
			</div>
		</>
	);
};

export default Dashboard;
