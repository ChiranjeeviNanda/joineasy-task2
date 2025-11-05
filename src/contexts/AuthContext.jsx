/**
 * Authentication context for managing user login state.
 * Provides login, logout, and role-based access information
 * across the application using React Context.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../data/mockData";

// Create authentication context
const AuthContext = createContext();

/**
 * Custom hook to access authentication context.
 * Returns auth context with user data and auth methods.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Retrieves the initial user state from localStorage, if available.
 * Safely parses JSON and returns null on failure.
 */
const getInitialState = () => {
	try {
		const storedUser = localStorage.getItem("currentUser");
		return storedUser ? JSON.parse(storedUser) : null;
	} catch (error) {
		console.error("Could not parse user from localStorage:", error);
		return null;
	}
};

/**
 * Authentication provider component.
 * Wraps the app and provides authentication state and actions.
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(getInitialState);
	const isAuthenticated = !!user;

	// Keep user state persistent across refreshes
	useEffect(() => {
		if (user) {
			localStorage.setItem("currentUser", JSON.stringify(user));
		} else {
			localStorage.removeItem("currentUser");
		}
	}, [user]);

	/**
	 * Handles login by validating credentials against mock users.
	 * Simulates API latency for demonstration.
	 */
	const login = async (username, password) => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const foundUser = mockUsers.find(
			(u) => u.username === username && u.password === password
		);

		if (foundUser) {
			setUser(foundUser);
			return { success: true, role: foundUser.role };
		} else {
			return { success: false, message: "Invalid credentials." };
		}
	};

	/** Logs the current user out and clears stored data. */
	const logout = () => setUser(null);

	// Provide user data and auth methods to consumers
	const value = {
		user,
		isAuthenticated,
		login,
		logout,
		role: user?.role,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
