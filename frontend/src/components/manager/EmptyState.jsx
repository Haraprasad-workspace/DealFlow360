export const LoadingState = ({ message = "Loading manager workspace..." }) => (
	<div className="loading-state">
		<span className="loader" /> {message}
	</div>
);

export const ErrorState = ({ message = "Unable to load manager data.", onRetry }) => (
	<div className="error-state" style={{ margin: "20px 0" }}>
		<div style={{ fontWeight: 600, marginBottom: "4px" }}>Error</div>
		<div>{message}</div>
		{onRetry ? (
			<button
				type="button"
				className="button button-secondary"
				style={{ marginTop: "12px", padding: "6px 12px", fontSize: "11px" }}
				onClick={onRetry}
			>
				Try Again
			</button>
		) : null}
	</div>
);

export const EmptyState = ({ title = "No records found", description = "There are no entries matching your filter criteria.", icon = "∅", action }) => (
	<div className="empty-state">
		<div className="empty-icon">{icon}</div>
		<h3>{title}</h3>
		<p>{description}</p>
		{action ? <div style={{ marginTop: "15px" }}>{action}</div> : null}
	</div>
);

export default EmptyState;
