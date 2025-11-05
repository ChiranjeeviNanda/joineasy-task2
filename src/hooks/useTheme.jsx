/**
 * Custom hook to manage the application's light/dark theme preference.
 * Syncs the selected theme with localStorage and applies it to the HTML root
 * element for DaisyUI compatibility.
 */

import { useState, useEffect, useCallback } from "react";

const THEME_KEY = "app-theme";
export const useTheme = () => {
	const [theme, setTheme] = useState(
		() => localStorage.getItem(THEME_KEY) || "light"
	);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	}, []);

	return { theme, toggleTheme };
};
