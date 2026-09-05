const AuthSyncError = ({ message, onRetry }) => (
	<div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
		<p className="font-medium">Could not load your account profile.</p>
		<p className="mt-1">{message}</p>
		{onRetry ? (
			<button
				type="button"
				onClick={onRetry}
				className="mt-3 rounded-lg bg-[#5B4CF5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4534E0]"
			>
				Retry
			</button>
		) : null}
	</div>
);

export default AuthSyncError;
