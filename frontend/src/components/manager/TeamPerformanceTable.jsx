const TeamPerformanceTable = ({ teamMembers = [] }) => {
	if (!teamMembers || teamMembers.length === 0) {
		return (
			<div className="empty-inline">
				No team performance data available for this team.
			</div>
		);
	}

	return (
		<div className="table-panel">
			<div className="table-head" style={{ gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 1fr" }}>
				<div>Sales Rep</div>
				<div>Revenue</div>
				<div>Orders</div>
				<div>Quotes</div>
				<div>Conversion Rate</div>
			</div>
			{teamMembers.map((member, index) => {
				const name = member.name || member.email || member.salesRepName || `Sales Rep ${index + 1}`;
				const email = member.email || member.salesRepEmail || "";
				const revenue = member.revenue ?? member.totalRevenue ?? 0;
				const orders = member.ordersCount ?? member.orders ?? 0;
				const quotations = member.quotationsCount ?? member.quotations ?? 0;
				const conversion = member.conversionRate ?? member.conversion ?? 0;

				return (
					<div
						key={member._id || member.salesRepId || index}
						className="table-row"
						style={{ gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 1fr" }}
					>
						<div className="person-cell">
							<div className="avatar">{name.slice(0, 1).toUpperCase()}</div>
							<div>
								<strong>{name}</strong>
								{email ? <small>{email}</small> : null}
							</div>
						</div>
						<div>
							<strong>${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
						</div>
						<div>
							<strong>{orders}</strong>
						</div>
						<div>
							<strong>{quotations}</strong>
						</div>
						<div>
							<strong>{typeof conversion === "number" ? `${conversion.toFixed(1)}%` : conversion}</strong>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TeamPerformanceTable;
