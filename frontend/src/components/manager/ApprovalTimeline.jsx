import ApprovalStatusBadge from "./ApprovalStatusBadge";

const ApprovalTimeline = ({ quotation }) => {
	if (!quotation) return null;

	const status = quotation.status || "DRAFT";
	const approvalInfo = quotation.approval || {};
	const requiresManagerApproval = approvalInfo.requiresManagerApproval !== false;
	const requiresFinanceApproval = approvalInfo.requiresFinanceApproval === true;

	return (
		<div className="panel" style={{ marginTop: "20px" }}>
			<div className="panel-heading">
				<h2>Approval Hierarchy</h2>
				<span className="eyebrow">Audit Chain</span>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				{/* Step 1: Sales Rep */}
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<div
						style={{
							width: "28px",
							height: "28px",
							borderRadius: "50%",
							background: "#60816A",
							color: "#FFFDF8",
							display: "grid",
							placeItems: "center",
							fontFamily: "Space Grotesk",
							fontWeight: 600,
							fontSize: "12px",
						}}
					>
						✓
					</div>
					<div>
						<strong style={{ fontSize: "13px", display: "block" }}>
							Sales Representative Submission
						</strong>
						<small className="muted-copy">
							{quotation.salesRep?.name || quotation.salesRep?.email || "Sales Rep"}
						</small>
					</div>
					<div style={{ marginLeft: "auto" }}>
						<span className="status-pill status-completed">Submitted</span>
					</div>
				</div>

				<div style={{ width: "2px", height: "16px", background: "#DFD9CE", marginLeft: "13px" }} />

				{/* Step 2: Sales Manager */}
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<div
						style={{
							width: "28px",
							height: "28px",
							borderRadius: "50%",
							background:
								status === "APPROVED"
									? "#60816A"
									: status === "REJECTED"
									? "#955347"
									: status === "PENDING_APPROVAL"
									? "#BB6B43"
									: "#AEB9AD",
							color: "#FFFDF8",
							display: "grid",
							placeItems: "center",
							fontFamily: "Space Grotesk",
							fontWeight: 600,
							fontSize: "12px",
						}}
					>
						{status === "APPROVED" ? "✓" : status === "REJECTED" ? "✕" : "2"}
					</div>
					<div>
						<strong style={{ fontSize: "13px", display: "block" }}>
							Sales Manager Approval Stage
						</strong>
						<small className="muted-copy">
							{requiresManagerApproval
								? approvalInfo.approvedByManagerAt
									? `Approved at ${new Date(approvalInfo.approvedByManagerAt).toLocaleDateString()}`
									: approvalInfo.rejectedAt
									? `Rejected: ${approvalInfo.rejectionReason || "No reason given"}`
									: "Pending review & approval"
								: "Auto-approved / Not required"}
						</small>
					</div>
					<div style={{ marginLeft: "auto" }}>
						<ApprovalStatusBadge status={status} />
					</div>
				</div>

				{/* Step 3: Finance (Optional) */}
				{requiresFinanceApproval ? (
					<>
						<div style={{ width: "2px", height: "16px", background: "#DFD9CE", marginLeft: "13px" }} />
						<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
							<div
								style={{
									width: "28px",
									height: "28px",
									borderRadius: "50%",
									background: "#AEB9AD",
									color: "#FFFDF8",
									display: "grid",
									placeItems: "center",
									fontFamily: "Space Grotesk",
									fontWeight: 600,
									fontSize: "12px",
								}}
							>
								3
							</div>
							<div>
								<strong style={{ fontSize: "13px", display: "block" }}>
									Finance & Risk Escalation
								</strong>
								<small className="muted-copy">Special financial terms authorization</small>
							</div>
							<div style={{ marginLeft: "auto" }}>
								<span className="status-pill status-pending_approval">Escalated</span>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
};

export default ApprovalTimeline;
