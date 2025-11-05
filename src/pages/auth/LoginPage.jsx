/**
 * Renders the login interface for both professors and students, with role-based redirection
 * upon successful authentication. Includes accessibility-friendly focus navigation,
 * error handling, and a responsive layout split into an illustration section and a login form.
 */

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import FormInput from "../../components/common/FormInput";
import {
	KeyRoundIcon,
	LaughIcon,
	UserRoundIcon,
	UserRoundCheckIcon,
	XCircleIcon,
	LayoutDashboardIcon,
} from "lucide-react";

const LoginPage = () => {
	// State Management
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Refs for Keyboard Navigation
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const submitRef = useRef(null);

	const { login } = useAuth();
	const navigate = useNavigate();

	/**
	 * Handles login form submission.
	 * - Calls the `login()` method from AuthContext.
	 * - Displays success/error toasts.
	 * - Redirects users to their respective dashboards based on role.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const result = await login(username, password);

		if (result.success) {
			toast.success(`Welcome, ${result.role}!`);

			// Role-based redirection
			if (result.role === "Professor") {
				navigate("/professor/dashboard", { replace: true });
			} else if (result.role === "Student") {
				navigate("/student/dashboard", { replace: true });
			}
		} else {
			const errorMessage =
				result.message ||
				"Login failed. Please check your credentials.";
			setError(errorMessage);
			toast.error(errorMessage);
		}

		setLoading(false);
	};

	/**
	 * Handles Enter key navigation between form fields.
	 * Moves focus to the next input or button based on provided `nextRef`.
	 */
	const handleKeyDown = (e, nextRef) => {
		if (e.key === "Enter" && nextRef?.current) {
			e.preventDefault();
			nextRef.current.focus();
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-5xl">
				<div className="card bg-base-100 rounded-2xl shadow-2xl border border-base-content/25">
					<div className="card-body p-6 sm:p-8 lg:p-10">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
							{/* Left Column: Info / Branding Section */}
							<div className="space-y-4 p-4 lg:p-8 rounded-xl bg-primary/5 hidden lg:block">
								{/* App Logo + Title */}
								<Link
									to="/login"
									className="flex items-left gap-2 group"
								>
									<LayoutDashboardIcon className="size-10 mr-1 text-primary" />
									<span className="text-3xl lg:text-4xl font-bold text-primary">
										My Dashboard
									</span>
								</Link>

								{/* Tagline */}
								<p className="text-lg text-base-content/80 leading-relaxed">
									Whether you're assigning coursework or
									submitting projects, our dashboard is the
									centralized hub designed for seamless
									learning and evaluation.
								</p>

								{/* Illustration */}
								<div className="mt-4">
									<img
										src="/login-image.svg"
										alt="System login illustration"
										className="w-4/5 h-auto object-contain mx-auto"
									/>
								</div>
							</div>

							{/* Right Column: Login Form */}
							<div className="space-y-6 w-full max-w-md mx-auto">
								{/* Welcome Banner */}
								<div className="text-center mb-8 py-4 px-6 bg-primary/5 rounded-2xl border border-primary/10 backdrop-blur-sm">
									<div className="flex items-center justify-center gap-3 mb-2">
										<LaughIcon
											className="size-6 text-primary animate-pulse"
											aria-hidden="true"
										/>
										<h2 className="text-xl font-bold text-primary">
											Hello there!
										</h2>
									</div>
									<p className="text-base text-base-content/70 font-medium">
										Sign in to continue to your dashboard
									</p>
								</div>

								{/* Error Alert */}
								{error && (
									<div
										className="alert alert-error"
										role="alert"
										aria-live="polite"
										id="form-error"
									>
										<XCircleIcon
											className="size-5"
											aria-hidden="true"
										/>
										<span className="font-semibold">
											{error}
										</span>
									</div>
								)}

								{/* Login Form */}
								<form
									onSubmit={handleSubmit}
									className="space-y-3"
								>
									<div className="space-y-3">
										{/* Username Field */}
										<FormInput
											id="username"
											label="Username"
											type="text"
											placeholder="eg. p101, s201"
											value={username}
											onChange={(e) =>
												setUsername(e.target.value)
											}
											icon={UserRoundIcon}
											disabled={loading}
											inputRef={usernameRef}
											onKeyDown={(e) =>
												handleKeyDown(e, passwordRef)
											}
										/>

										{/* Password Field */}
										<FormInput
											id="password"
											label="Password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											icon={KeyRoundIcon}
											disabled={loading}
											inputRef={passwordRef}
											onKeyDown={(e) =>
												handleKeyDown(e, submitRef)
											}
										/>
									</div>

									<div className="space-y-3">
										{/* Submit Button */}
										<button
											ref={submitRef}
											className="btn btn-primary btn-block h-16 rounded-2xl text-xl font-semibold mt-3 focus:ring-2 focus:ring-primary focus:ring-offset-2"
											type="submit"
											disabled={loading}
											tabIndex={0}
											aria-describedby={
												error ? "form-error" : undefined
											}
										>
											{!loading ? (
												<>
													<UserRoundCheckIcon
														className="size-6 mr-2"
														aria-hidden="true"
													/>
													Login
												</>
											) : (
												<>
													<span
														className="loading loading-dots size-6 mr-2"
														aria-hidden="true"
													/>
													Logging in...
												</>
											)}
										</button>

										{/* Signup Redirect */}
										<p className="text-sm text-center text-base-content/70">
											Don't have an account?{" "}
											<Link
												to="/signup"
												className="text-primary hover:underline font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
												tabIndex={0}
											>
												Sign up
											</Link>
										</p>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
