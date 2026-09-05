const VerificationCodeForm = ({ code, onCodeChange, onSubmit, isSubmitting, error }) => (
	<form className="space-y-4" onSubmit={onSubmit}>
		<div>
			<label
				htmlFor="verification-code"
				className="mb-1.5 block text-sm font-medium text-[#1A1B25]"
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
				className="w-full rounded-lg border border-[#D6D7E4] bg-white px-3 py-2.5 text-sm text-[#1A1B25] outline-none focus:border-[#5B4CF5] focus:ring-[3px] focus:ring-[#EFEDFF]"
				placeholder="Enter the code sent to your email"
				required
			/>
		</div>

		{error ? (
			<p className="text-sm text-red-600" role="alert">
				{error}
			</p>
		) : null}

		<button
			type="submit"
			disabled={isSubmitting}
			className="w-full rounded-lg bg-[#5B4CF5] px-[18px] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4534E0] disabled:cursor-not-allowed disabled:opacity-70"
		>
			{isSubmitting ? "Verifying..." : "Verify Email"}
		</button>
	</form>
);

export default VerificationCodeForm;
