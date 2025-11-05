/**
 * Provides a button for switching between light and dark themes using DaisyUI's `swap` animation.
 * Uses the global theme context to track and toggle the current theme.
 */

import { useTheme } from "../../contexts/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";

const ThemeToggle = () => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<label
			className="swap swap-rotate btn btn-ghost btn-circle tooltip tooltip-bottom"
			data-tip="Switch Theme"
		>
			{/* Hidden checkbox that controls the toggle animation */}
			<input
				type="checkbox"
				checked={isDark}
				onChange={toggleTheme}
				className="hidden"
				aria-label="Toggle theme"
			/>

			{/* Light mode icon */}
			<SunIcon className="swap-off size-6" />

			{/* Dark mode icon */}
			<MoonIcon className="swap-on size-6" />
		</label>
	);
};

export default ThemeToggle;
