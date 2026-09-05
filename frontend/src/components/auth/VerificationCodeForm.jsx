const VerificationCodeForm = ({ code, onCodeChange, onSubmit, isSubmitting, error }) => (
	<form className="auth-form" onSubmit={onSubmit}>
		<div>
			<label
				htmlFor="verification-code"
				className="auth-form-label"
			>
				Verification Code
			</label>
			<input
				id="verification-code"
				type="text"
				inputMode="numeric"
				autoComplete="one-time-code"
				value={code}
				onChange={(event) => onCodeChange(event.target.value)}
				className="auth-form-input"
				placeholder="Enter the code sent to your email"
				required
			/>
		</div>

		{error ? (
			<p className="auth-form-error" role="alert">
				{error}
			</p>
		) : null}

		<button
			type="submit"
			disabled={isSubmitting}
			className="auth-submit-button"
		>
			{isSubmitting ? "Verifying..." : "Verify Email"}
		</button>
	</form>
);

export default VerificationCodeForm;
