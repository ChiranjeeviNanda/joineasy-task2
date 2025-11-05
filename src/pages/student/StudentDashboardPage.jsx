/**
 * Displays a student's personalized dashboard with a summary of academic progress,
 * including total assignments, completed tasks, pending work, and enrolled courses.
 * Calculates progress dynamically across courses using DataContext state.
 */

import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import CourseCard from "../../components/common/CourseCard";

import {
	ClipboardListIcon,
	LibraryIcon,
	FileTextIcon,
	CheckCircleIcon,
	ClockIcon,
} from "lucide-react";

const StudentDashboardPage = () => {
	const { user } = useAuth();
	const { assignments, acknowledgments, groups, mockCourses } = useData();

	// Filter courses where the current student is enrolled
	const studentCourses = mockCourses.filter((course) =>
		course.studentIds.includes(user?.id)
	);

	/**
	 * Calculates assignment completion stats for a given course.
	 * Includes both individual and group submissions.
	 */
	const calculateCourseProgress = (courseId) => {
		const courseAssignments = assignments.filter(
			(a) => a.courseId === courseId
		);
		const totalAssignments = courseAssignments.length;
		if (totalAssignments === 0) return { total: 0, acknowledged: 0 };

		let acknowledgedCount = 0;

		courseAssignments.forEach((assignment) => {
			const isAcknowledged = acknowledgments.some(
				(ack) =>
					// Individual submission check
					(assignment.submissionType === "Individual" &&
						ack.submitterId === user.id &&
						ack.assignmentId === assignment.id) ||
					// Group submission check
					(assignment.submissionType === "Group" &&
						groups.some(
							(group) =>
								group.id === ack.submitterId &&
								group.memberIds.includes(user.id)
						) &&
						ack.assignmentId === assignment.id)
			);

			if (isAcknowledged) acknowledgedCount++;
		});

		return { total: totalAssignments, acknowledged: acknowledgedCount };
	};

	/**
	 * Calculates overall progress stats across all enrolled courses.
	 * Uses memoization for performance optimization.
	 */
	const {
		totalAssignments,
		completedAssignments,
		pendingAssignments,
		progressPercentage,
	} = useMemo(() => {
		let total = 0;
		let completed = 0;

		studentCourses.forEach((course) => {
			const { total: courseTotal, acknowledged: courseAcknowledged } =
				calculateCourseProgress(course.id);
			total += courseTotal;
			completed += courseAcknowledged;
		});

		const pending = total - completed;
		const percentage =
			total > 0 ? Math.round((completed / total) * 100) : 0;

		return {
			totalAssignments: total,
			completedAssignments: completed,
			pendingAssignments: pending,
			progressPercentage: percentage,
		};
	}, [studentCourses, user.id, assignments, acknowledgments]);

	/**
	 * Helper for CourseCard badges — computes per-course completion percentage.
	 */
	const calculateOverallCourseProgress = (courseId) => {
		const { total, acknowledged } = calculateCourseProgress(courseId);
		return total > 0 ? Math.round((acknowledged / total) * 100) : 0;
	};

	return (
		<div className="min-h-screen p-4 sm:p-8">
			<div className="max-w-7xl mx-auto space-y-8 pt-20 sm:pt-12">
				{/* Dashboard Header */}
				<header className="p-6 sm:p-8 backdrop-blur-sm rounded-2xl shadow-xl border border-base-content/25">
					<div className="flex items-center space-x-4 mb-2">
						<LibraryIcon className="size-8 sm:size-10 text-primary" />
						<h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
							Welcome, {user.name}!
						</h1>
					</div>
					<p className="text-base-content/70 text-sm sm:text-lg ml-12 sm:ml-14">
						Ready to check your assignments? Today is{" "}
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
					{/* Total Assignments Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-primary">
							<FileTextIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Total Assignments
						</div>
						<div className="stat-value text-3xl sm:text-4xl">
							{totalAssignments}
						</div>
					</div>

					{/* Completed Assignments Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-success">
							<CheckCircleIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Completed
						</div>
						<div className="stat-value text-success text-3xl sm:text-4xl">
							{completedAssignments}
						</div>
					</div>

					{/* Pending Assignments Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-warning">
							<ClockIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Pending
						</div>
						<div className="stat-value text-warning text-3xl sm:text-4xl">
							{pendingAssignments}
						</div>
					</div>

					{/* Overall Progress Stat */}
					<div className="stat p-4 sm:p-6">
						<div className="stat-title font-semibold text-base sm:text-lg">
							Overall Progress
						</div>
						<div className="stat-value text-3xl sm:text-4xl font-extrabold">
							{progressPercentage}%
						</div>
						<progress
							className="progress progress-primary w-full mt-2"
							value={progressPercentage}
							max="100"
						></progress>
					</div>
				</div>

				{/* Course Listing */}
				<h2 className="text-2xl sm:text-3xl font-bold border-b border-base-content/25 pb-2 text-primary flex items-center">
					<ClipboardListIcon className="size-7 mr-3" />
					Your Enrolled Courses
				</h2>

				{studentCourses.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{studentCourses.map((course) => {
							const progress = calculateOverallCourseProgress(
								course.id
							);
							return (
								<div key={course.id} className="relative">
									{/* Per-course progress badge */}
									<div
										className={`badge badge-lg absolute top-4 right-4 z-10 ${
											progress === 100
												? "badge-success"
												: "badge-primary"
										}`}
									>
										{progress}% Complete
									</div>
									<CourseCard
										course={course}
										role="Student"
									/>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-center p-12 border-2 border-dashed rounded-xl border-base-content/20">
						<p className="text-lg">
							You are not currently enrolled in any courses.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentDashboardPage;
