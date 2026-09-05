import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getOrders, getOrderStats, getErrorMessage } from "../../services/manager.service";
import ApprovalStatusBadge from "../../components/manager/ApprovalStatusBadge";
import { LoadingState, ErrorState, EmptyState } from "../../components/manager/EmptyState";

const ManagerOrders = () => {
	const [orders, setOrders] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [searchQuery, setSearchQuery] = useState("");

	const loadOrders = useCallback(() => {
		setLoading(true);
		setError("");
		const params = {};
		if (statusFilter !== "ALL") params.status = statusFilter;

		Promise.allSettled([
			getOrders(params),
			getOrderStats(),
		])
			.then(([listRes, statsRes]) => {
				if (listRes.status === "fulfilled") {
					const resData = listRes.value.data;
					setOrders(Array.isArray(resData) ? resData : resData?.orders || []);
				} else {
					setError(getErrorMessage(listRes.reason));
				}

				if (statsRes.status === "fulfilled") {
					setStats(statsRes.value.data);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(getErrorMessage(err));
				setLoading(false);
			});
	}, [statusFilter]);

	useEffect(() => {
		let active = true;
		const params = {};
		if (statusFilter !== "ALL") params.status = statusFilter;

		Promise.allSettled([
			getOrders(params),
			getOrderStats(),
		])
			.then(([listRes, statsRes]) => {
				if (!active) return;
				if (listRes.status === "fulfilled") {
					const resData = listRes.value.data;
					setOrders(Array.isArray(resData) ? resData : resData?.orders || []);
				} else {
					setError(getErrorMessage(listRes.reason));
				}

				if (statsRes.status === "fulfilled") {
					setStats(statsRes.value.data);
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
	}, [statusFilter]);

	const filteredOrders = orders.filter((o) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		const oNum = (o.orderNumber || "").toLowerCase();
		const cust = (o.customer?.name || o.customerName || "").toLowerCase();
		const rep = (o.salesRep?.name || o.salesRepName || "").toLowerCase();
		return oNum.includes(query) || cust.includes(query) || rep.includes(query);
	});

	return (
		<div>
			<div className="page-header">
				<div>
					<h1>Team Orders</h1>
					<p className="page-description">
						Track closed deals, order execution, and fulfillment progress across your sales team.
					</p>
				</div>
			</div>

			{stats ? (
				<div className="metric-grid" style={{ marginBottom: "20px" }}>
					<div className="metric-card">
						<span>Total Team Orders</span>
						<strong>{stats.totalOrders ?? orders.length}</strong>
					</div>
					<div className="metric-card">
						<span>Completed Deals</span>
						<strong>{stats.completedOrders ?? 0}</strong>
					</div>
					<div className="metric-card">
						<span>Processing / Fulfilling</span>
						<strong>{stats.inProgressOrders ?? 0}</strong>
					</div>
					<div className="metric-card">
						<span>Total Booked Revenue</span>
						<strong>${(stats.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
					</div>
				</div>
			) : null}

			<div className="toolbar">
				<input
					type="text"
					className="search-input"
					placeholder="Search by order #, customer, or sales rep..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
					<option value="ALL">All Statuses</option>
					<option value="CONFIRMED">Confirmed</option>
					<option value="PROCESSING">Processing</option>
					<option value="FULFILLING">Fulfilling</option>
					<option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
					<option value="COMPLETED">Completed</option>
					<option value="CANCELLED">Cancelled</option>
				</select>

				<span className="toolbar-note">
					Showing {filteredOrders.length} team orders
				</span>
			</div>

			{loading ? (
				<LoadingState message="Loading team orders..." />
			) : error ? (
				<ErrorState message={error} onRetry={loadOrders} />
			) : filteredOrders.length === 0 ? (
				<EmptyState
					title="No orders found"
					description="No team orders match your selected filters."
				/>
			) : (
				<div className="table-panel">
					<div className="table-head" style={{ gridTemplateColumns: "1.3fr 1.4fr 1.2fr 1.1fr 1fr 0.8fr" }}>
						<div>Order #</div>
						<div>Customer</div>
						<div>Sales Rep</div>
						<div>Amount</div>
						<div>Status</div>
						<div>Action</div>
					</div>

					{filteredOrders.map((o) => {
						const id = o._id || o.id;
						const oNum = o.orderNumber || "—";
						const customerName = o.customer?.name || o.customerName || "Customer";
						const repName = o.salesRep?.name || o.salesRepName || "Sales Rep";
						const amount = o.grandTotal ?? o.subtotal ?? 0;
						const status = o.status || "CONFIRMED";

						return (
							<div
								key={id}
								className="table-row"
								style={{ gridTemplateColumns: "1.3fr 1.4fr 1.2fr 1.1fr 1fr 0.8fr" }}
							>
								<div>
									<strong>{oNum}</strong>
									<small>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}</small>
								</div>
								<div>
									<strong>{customerName}</strong>
								</div>
								<div>
									<strong>{repName}</strong>
								</div>
								<div>
									<strong>${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
								</div>
								<div>
									<ApprovalStatusBadge status={status} />
								</div>
								<div>
									<Link
										to={`/sales-manager/orders/${id}`}
										className="button button-secondary"
										style={{ padding: "5px 10px", fontSize: "11px" }}
									>
										Inspect
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

export default ManagerOrders;
