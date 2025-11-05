/**
 * Displays a professor's personalized dashboard with a summary of teaching activity,
 * including active courses, total students, and assignments, using state from DataContext.
 */

import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import CourseCard from "../../components/common/CourseCard";

import {
	LibraryIcon,
	UsersRoundIcon,
	BookOpenIcon,
	ClipboardListIcon,
} from "lucide-react";

const ProfessorDashboardPage = () => {
	const { user } = useAuth();
	const { getUserCourses, assignments, mockCourses } = useData();

	const professorCourses = getUserCourses;

	// Extract all course IDs for data lookups
	const courseIds = useMemo(
		() => professorCourses.map((c) => c.id),
		[professorCourses]
	);

	// Calculate total unique students across professor's courses
	const totalEnrolledStudents = useMemo(() => {
		const uniqueStudentIds = new Set();
		professorCourses.forEach((course) => {
			course.studentIds.forEach((id) => uniqueStudentIds.add(id));
		});
		return uniqueStudentIds.size;
	}, [professorCourses]);

	// Count total assignments linked to the professor's courses
	const totalAssignments = useMemo(() => {
		return assignments.filter((assignment) =>
			courseIds.includes(assignment.courseId)
		).length;
	}, [courseIds, assignments]);

	return (
		<div className="min-h-screen p-4 sm:p-8">
			<div className="max-w-7xl mx-auto space-y-8 pt-20 sm:pt-12">
				{/* Dashboard Header */}
				<header className="p-6 sm:p-8 backdrop-blur-sm rounded-2xl shadow-xl border border-base-content/25">
					<div className="flex items-center space-x-4 mb-2">
						<LibraryIcon className="size-8 sm:size-10 text-primary" />
						<h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
							Welcome, {user?.name}!
						</h1>
					</div>
					<p className="text-base-content/70 text-sm sm:text-lg ml-12 sm:ml-14">
						Ready to review submissions? Today is{" "}
						<span className="font-semibold text-base-content">
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
						.
					</p>
				</header>

				{/* Summary Statistics Section */}
				<div className="stats stats-vertical md:stats-horizontal shadow w-full rounded-2xl border border-base-content/25 bg-base-100">
					{/* Active Courses Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-primary">
							<BookOpenIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Active Courses
						</div>
						<div className="stat-value text-3xl sm:text-4xl">
							{professorCourses.length}
						</div>
						<div className="stat-desc text-base-content/50">
							Courses you are currently teaching
						</div>
					</div>

					{/* Total Students Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-warning">
							<UsersRoundIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Total Students
						</div>
						<div className="stat-value text-3xl sm:text-4xl">
							{totalEnrolledStudents}
						</div>
						<div className="stat-desc text-base-content/50">
							Unique students across your courses
						</div>
					</div>

					{/* Total Assignments Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-success">
							<ClipboardListIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Course Assignments
						</div>
						<div className="stat-value text-3xl sm:text-4xl">
							{totalAssignments}
						</div>
						<div className="stat-desc text-base-content/50">
							Assignments across all your active courses
						</div>
					</div>
				</div>

				{/* Course Listing */}
				<h2 className="text-2xl sm:text-3xl font-bold border-b border-base-content/25 pb-2 text-primary flex items-center">
					<ClipboardListIcon className="size-7 mr-3" />
					Your Active Courses
				</h2>

				{professorCourses.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{professorCourses.map((course) => (
							<CourseCard
								key={course.id}
								course={course}
								role="Professor"
							/>
						))}
					</div>
				) : (
					<div className="text-center p-12 border-2 border-dashed rounded-xl border-base-content/20">
						<p className="text-lg">
							You are not currently teaching any courses this
							semester.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfessorDashboardPage;
