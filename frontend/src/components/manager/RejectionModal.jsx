import { useState } from "react";

const RejectionModal = ({ quotationNumber, onSubmit, onClose, submitting }) => {
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!reason.trim()) {
			setError("A rejection reason is required.");
			return;
		}
		setError("");
		onSubmit(reason.trim());
	};

	return (
		<div className="modal-backdrop">
			<div className="modal">
				<div className="modal-heading">
					<h2>Reject Quotation</h2>
					<button type="button" className="close-button" onClick={onClose}>
						×
					</button>
				</div>
				<p style={{ margin: "0 0 10px", fontSize: "12px", color: "#737A72" }}>
					Please provide a detailed reason for rejecting quotation{" "}
					<strong>{quotationNumber}</strong>. The sales representative will receive this feedback.
				</p>
				<form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
					<div>
						<label htmlFor="rejectionReason">Rejection Reason *</label>
						<textarea
							id="rejectionReason"
							rows={4}
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="Enter explanation for rejection..."
							style={{
								width: "100%",
								marginTop: "6px",
								padding: "10px",
								border: "1px solid #D7D4CA",
								background: "#FFFDF8",
								fontFamily: "DM Sans",
								fontSize: "12px",
								outline: "none",
							}}
							disabled={submitting}
						/>
					</div>

					{error ? <div className="form-error">{error}</div> : null}

					<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
						<button
							type="button"
							className="button button-secondary"
							onClick={onClose}
							disabled={submitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="button"
							style={{ background: "#955347", color: "#FFFDF8" }}
							disabled={submitting}
						>
							{submitting ? "Rejecting..." : "Confirm Rejection"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RejectionModal;
