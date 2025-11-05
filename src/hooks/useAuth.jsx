/**
 * Custom hook to access authentication-related data and actions.
 * Provides the current user, authentication status, and auth utilities
 * from the AuthContext without needing to import the context directly.
 */

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);
