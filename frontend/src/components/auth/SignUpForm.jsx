import { useState } from "react";
import { useSignUp } from "@clerk/react/legacy";
import { ROLE_OPTIONS } from "../../constants/roles";
import VerificationCodeForm from "./VerificationCodeForm";

const splitName = (fullName) => {
	const trimmedName = fullName.trim();
	const [firstName, ...rest] = trimmedName.split(/\s+/);

	return {
		firstName: firstName || "",
		lastName: rest.join(" "),
	};
};

const SignUpForm = ({ onComplete }) => {
	const { isLoaded, signUp, setActive } = useSignUp();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState(ROLE_OPTIONS[0].value);
	const [verificationCode, setVerificationCode] = useState("");
	const [pendingVerification, setPendingVerification] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSignUpSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!isLoaded) {
			return;
		}

		try {
			setIsSubmitting(true);
			const { firstName, lastName } = splitName(name);

			await signUp.create({
				emailAddress: email,
				password,
				firstName,
				lastName,
				unsafeMetadata: { role },
			});

			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
			setPendingVerification(true);
		} catch (signUpError) {
			const message =
				signUpError?.errors?.[0]?.longMessage ||
				signUpError?.errors?.[0]?.message ||
				"Unable to create account. Please try again.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerificationSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!isLoaded) {
			return;
		}

		try {
			setIsSubmitting(true);

			const result = await signUp.attemptEmailAddressVerification({
				code: verificationCode,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				onComplete?.();
				return;
			}

			setError("Verification incomplete. Please check the code and try again.");
		} catch (verificationError) {
			const message =
				verificationError?.errors?.[0]?.longMessage ||
				verificationError?.errors?.[0]?.message ||
				"Invalid verification code. Please try again.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isLoaded) {
		return (
			<p className="text-sm text-[#5C5D6E]">Loading sign-up form...</p>
		);
	}

	if (pendingVerification) {
		return (
			<VerificationCodeForm
				code={verificationCode}
				onCodeChange={setVerificationCode}
				onSubmit={handleVerificationSubmit}
				isSubmitting={isSubmitting}
				error={error}
			/>
		);
	}

	return (
		<form className="space-y-4" onSubmit={handleSignUpSubmit}>
			<div>
				<label
					htmlFor="signup-name"
					className="mb-1.5 block text-sm font-medium text-[#1A1B25]"
				>
					Name
				</label>
				<input
					id="signup-name"
					type="text"
					value={name}
					onChange={(event) => setName(event.target.value)}
					className="w-full rounded-lg border border-[#D6D7E4] bg-white px-3 py-2.5 text-sm text-[#1A1B25] outline-none focus:border-[#5B4CF5] focus:ring-[3px] focus:ring-[#EFEDFF]"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="signup-email"
					className="mb-1.5 block text-sm font-medium text-[#1A1B25]"
				>
					Email
				</label>
				<input
					id="signup-email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					className="w-full rounded-lg border border-[#D6D7E4] bg-white px-3 py-2.5 text-sm text-[#1A1B25] outline-none focus:border-[#5B4CF5] focus:ring-[3px] focus:ring-[#EFEDFF]"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="signup-password"
					className="mb-1.5 block text-sm font-medium text-[#1A1B25]"
				>
					Password
				</label>
				<input
					id="signup-password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					className="w-full rounded-lg border border-[#D6D7E4] bg-white px-3 py-2.5 text-sm text-[#1A1B25] outline-none focus:border-[#5B4CF5] focus:ring-[3px] focus:ring-[#EFEDFF]"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="signup-role"
					className="mb-1.5 block text-sm font-medium text-[#1A1B25]"
				>
					Role
				</label>
				<select
					id="signup-role"
					value={role}
					onChange={(event) => setRole(event.target.value)}
					className="w-full rounded-lg border border-[#D6D7E4] bg-white px-3 py-2.5 text-sm text-[#1A1B25] outline-none focus:border-[#5B4CF5] focus:ring-[3px] focus:ring-[#EFEDFF]"
					required
				>
					{ROLE_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
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
				{isSubmitting ? "Creating account..." : "Sign Up"}
			</button>
		</form>
	);
};

export default SignUpForm;
