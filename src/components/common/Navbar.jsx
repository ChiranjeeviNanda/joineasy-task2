/**
 * Global navigation bar that appears at the top of all pages.
 * Displays the app logo, user role, theme toggle, and logout option.
 * Automatically adjusts content based on authentication state and user role.
 */

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";
import { LayoutDashboardIcon, LogOutIcon, UserRoundIcon } from "lucide-react";

const Navbar = () => {
	const { user, isAuthenticated, logout, role } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		toast.success("Logged out successfully!");
		navigate("/login", { replace: true });
	};

	// Determine dashboard link based on role
	const dashboardLink =
		role === "Professor" ? "/professor/dashboard" : "/student/dashboard";

	return (
		<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full px-4">
			<div className="flex items-center justify-between gap-4 bg-base-100/90 px-6 py-3 rounded-2xl backdrop-blur-xl border border-base-content/25 shadow-xl">
				{/* Logo */}
				<Link
					to={isAuthenticated ? dashboardLink : "/login"}
					className="flex items-center gap-4 group"
				>
					<LayoutDashboardIcon className="w-6 h-6 mr-1 text-primary" />
					<span className="text-xl sm:text-2xl font-bold text-base-content group-hover:text-primary transition-colors duration-200">
						<p className="hidden sm:inline">Assignment</p> Dashboard
					</span>
				</Link>

				{/* Buttons */}
				<div className="flex items-center gap-3">
					{/* User Info (visible only when authenticated) */}
					{isAuthenticated && (
						<div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-base-200 rounded-full border border-base-content/10">
							<UserRoundIcon className="size-4 text-primary" />
							<span className="text-sm font-semibold text-base-content/80 capitalize">
								{user.role} ({user.id})
							</span>
						</div>
					)}

					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Logout Button */}
					{isAuthenticated && (
						<Link
							to="/login"
							onClick={handleLogout}
							className="btn btn-outline btn-sm text-base-content border-base-content/50 hover:bg-base-focus group"
							aria-label="Logout"
						>
							<LogOutIcon className="size-5 transition-transform group-hover:scale-110" />
							<span className="hidden sm:inline font-semibold">
								Logout
							</span>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
