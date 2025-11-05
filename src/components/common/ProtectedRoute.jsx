/**
 * Route guard component that restricts access based on authentication and role.
 * Redirects unauthenticated users to the login page and ensures users can only
 * access routes matching their assigned role.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
	const { isAuthenticated, role } = useAuth();
	const location = useLocation();

	// Redirect unauthenticated users to the login page
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Restrict access if user's role does not match the required role
	if (requiredRole && role !== requiredRole) {
		const redirectPath =
			role === "Professor"
				? "/professor/dashboard"
				: "/student/dashboard";
		return <Navigate to={redirectPath} replace />;
	}

	// Authorized users can access the route
	return children;
};

export default ProtectedRoute;
