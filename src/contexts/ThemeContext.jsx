/**
 * Theme context for managing global light and dark modes.
 * Synchronizes theme preference with localStorage and applies
 * it to the document root for consistent UI styling.
 */

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const LIGHT_THEME = "light";
const DARK_THEME = "dark";

/**
 * Provides theme management (light/dark) across the application.
 * Automatically syncs the selected theme with local storage and the HTML root element.
 */
export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		return localStorage.getItem("theme") || LIGHT_THEME;
	});

	/** Apply the selected theme to the document and persist it. */
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	/** Toggles between light and dark modes. */
	const toggleTheme = useCallback(() => {
		setTheme((prev) => (prev === LIGHT_THEME ? DARK_THEME : LIGHT_THEME));
	}, []);

	const value = {
		theme,
		toggleTheme,
		isDark: theme === DARK_THEME,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};
