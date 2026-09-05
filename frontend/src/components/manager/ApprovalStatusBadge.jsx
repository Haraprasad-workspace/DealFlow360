const ApprovalStatusBadge = ({ status }) => {
	if (!status) return null;

	const normalized = status.toLowerCase().replace(/\s+/g, "_");
	const displayLabel = status.replace(/_/g, " ");

	return (
		<span className={`status-pill status-${normalized}`}>
			{displayLabel}
		</span>
	);
};

export default ApprovalStatusBadge;
