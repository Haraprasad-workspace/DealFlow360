const ManagerKpiCard = ({ title, value, subtext, format }) => {
	const formattedValue =
		typeof value === "number"
			? format === "currency"
				? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
				: format === "percent"
				? `${value}%`
				: value.toLocaleString()
			: value ?? "0";

	return (
		<div className="metric-card">
			<span>{title}</span>
			<strong>{formattedValue}</strong>
			{subtext ? <small>{subtext}</small> : null}
		</div>
	);
};

export default ManagerKpiCard;
