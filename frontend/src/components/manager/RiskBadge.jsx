const RiskBadge = ({ level, score }) => {
	if (!level) return null;

	const normalized = level.toLowerCase();

	return (
		<span className={`status-pill status-${normalized}`}>
			{level} {score !== undefined && score !== null ? `(${score})` : ""}
		</span>
	);
};

export default RiskBadge;
