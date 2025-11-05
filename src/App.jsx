/**
 * Main application router configuration.
 * Defines public and protected routes for professors and students,
 * along with global UI components like Navbar and Toaster notifications.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import ProfessorDashboardPage from "./pages/professor/ProfessorDashboardPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import AssignmentManagementPage from "./pages/professor/AssignmentManagementPage";
import StudentAssignmentsPage from "./pages/student/StudentAssignmentsPage";

const App = () => {
	return (
		<div className="min-h-screen bg-base-100 text-base-content">
			{/* Global navigation bar */}
			<Navbar />

			{/* Main route section */}
			<main className="p-4 md:p-8">
				<Routes>
					{/*  Public Routes  */}
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/"
						element={<Navigate to="/login" replace />}
					/>

					{/*  Professor Routes  */}
					<Route
						path="/professor/dashboard"
						element={
							<ProtectedRoute requiredRole="Professor">
								<ProfessorDashboardPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/professor/courses/:courseId/assignments"
						element={
							<ProtectedRoute requiredRole="Professor">
								<AssignmentManagementPage />
							</ProtectedRoute>
						}
					/>

					{/*  Student Routes  */}
					<Route
						path="/student/dashboard"
						element={
							<ProtectedRoute requiredRole="Student">
								<StudentDashboardPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/student/courses/:courseId/assignments"
						element={
							<ProtectedRoute requiredRole="Student">
								<StudentAssignmentsPage />
							</ProtectedRoute>
						}
					/>

					{/*  Fallback Route  */}
					<Route
						path="*"
						element={
							<h1 className="text-3xl font-bold text-center">
								404 - Not Found
							</h1>
						}
					/>
				</Routes>
			</main>

			{/* Global toast notifications */}
			<Toaster position="top-center" toastOptions={{ duration: 3000 }} />
		</div>
	);
};

export default App;
