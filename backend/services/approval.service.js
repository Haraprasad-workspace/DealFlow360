
const determineApproval = ({ grandTotal, margin, riskScore = 0 }) => {
	const required = grandTotal >= 10000 || margin < 15 || riskScore >= 30;
	const financeRequired = grandTotal >= 10000 || riskScore >= 70;
	return {
		required,
		currentLevel: required ? (financeRequired ? "FINANCE" : "MANAGER") : "NONE",
		status: required ? "PENDING" : "NOT_REQUIRED",
	};
};

module.exports = { determineApproval };
