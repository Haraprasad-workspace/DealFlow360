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
			<p className="auth-loading-copy">Loading sign-up form...</p>
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
		<form className="auth-form" onSubmit={handleSignUpSubmit}>
			<div>
				<label
					htmlFor="signup-name"
					className="auth-form-label"
				>
					Name
				</label>
				<input
					id="signup-name"
					type="text"
					value={name}
					onChange={(event) => setName(event.target.value)}
					className="auth-form-input"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="signup-email"
					className="auth-form-label"
				>
					Email
				</label>
				<input
					id="signup-email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					className="auth-form-input"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="signup-password"
					className="auth-form-label"
				>
					Password
				</label>
				<input
					id="signup-password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					className="auth-form-input"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="signup-role"
					className="auth-form-label"
				>
					Role
				</label>
				<select
					id="signup-role"
					value={role}
					onChange={(event) => setRole(event.target.value)}
					className="auth-form-input"
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
				<p className="auth-form-error" role="alert">
					{error}
				</p>
			) : null}

			<button
				type="submit"
				disabled={isSubmitting}
				className="auth-submit-button"
			>
				{isSubmitting ? "Creating account..." : "Sign Up"}
			</button>
		</form>
	);
};

export default SignUpForm;
