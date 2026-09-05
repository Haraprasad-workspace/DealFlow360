const approvalStageFor = (approval) => ({
	NONE: "NONE_REQUIRED",
	MANAGER: "PENDING_MANAGER",
	MANAGER_FINANCE: "PENDING_FINANCE",
}[approval] || "PENDING_FINANCE");

const blendedRiskFor = (approvalStage) => ({
	NONE_REQUIRED: "LOW",
	PENDING_MANAGER: "MEDIUM",
	PENDING_FINANCE: "HIGH",
}[approvalStage] || "HIGH");

const calculateBlendedRisk = ({
	items,
	customerTier,
	tierConfigs,
	categoryConfigs,
	approvalRules,
}) => {
	const configWarnings = [];
	let blendedOverage = 0;
	const linesWithStatus = items.map((item) => {
		const category = item.product?.category || item.category;
		const tierConfig = tierConfigs.find(
			(config) =>
				config.customerTier === customerTier && config.category === category,
		);
		const categoryConfig = categoryConfigs.find(
			(config) => config.category === category,
		);
		const discount = Number(item.discount || 0);

		if (!tierConfig || !categoryConfig) {
			configWarnings.push({ category, customerTier });
			return {
				...item,
				lineStatus: "NO_CONFIG",
				overagePoints: 0,
			};
		}

		const effectiveLimitPct = Math.min(
			tierConfig.maxDiscount,
			categoryConfig.maxDiscount,
		);
		const overagePoints = Math.max(0, discount - effectiveLimitPct);
		blendedOverage += overagePoints;
		return {
			...item,
			effectiveLimitPct,
			lineStatus: overagePoints > 0 ? "OVER" : "OK",
			overagePoints,
		};
	});

	const approvalRule = approvalRules.find(
		(rule) =>
			blendedOverage >= rule.minDiscount &&
			blendedOverage <= rule.maxDiscount,
	);
	if (!approvalRule) {
		configWarnings.push({ type: "approval", blendedOverage });
	}
	const requiredApprovalStage = approvalStageFor(approvalRule?.approval);

	return {
		linesWithStatus,
		blendedRisk: blendedRiskFor(requiredApprovalStage),
		requiredApprovalStage,
		configWarnings,
		blendedOverage,
	};
};

module.exports = { calculateBlendedRisk };
