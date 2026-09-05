const AuthSyncError = ({ message, onRetry }) => (
	<div className="auth-error-banner">
		<p className="auth-error-title">Could not load your account profile.</p>
		<p>{message}</p>
		{onRetry ? (
			<button
				type="button"
				onClick={onRetry}
				className="auth-retry-button"
			>
				Retry
			</button>
		) : null}
	</div>
);

export default AuthSyncError;
