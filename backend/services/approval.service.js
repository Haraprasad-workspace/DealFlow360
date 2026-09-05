const determineApproval = ({ grandTotal = 0, margin = 0, riskScore = 0, items = [] }) => {
	const maxDiscount = Math.max(0, ...items.map((i) => i.discount || 0));
	const managerRequired = grandTotal >= 5000 || margin < 25 || riskScore >= 20 || maxDiscount >= 10;
	const financeRequired = maxDiscount >= 15 || riskScore >= 40 || margin < 15;

	return {
		required: managerRequired || financeRequired,
		managerRequired,
		financeRequired,
		currentLevel: managerRequired ? "MANAGER" : (financeRequired ? "FINANCE" : "NONE"),
		status: managerRequired || financeRequired ? "PENDING" : "NOT_REQUIRED",
	};
};

module.exports = { determineApproval };
