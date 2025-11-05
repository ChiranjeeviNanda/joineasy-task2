/**
 * Displays detailed submission analytics for a specific assignment.
 * Allows professors to review student or group submission statuses
 * and view linked assignment files.
 */

import { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import {
	UsersRoundIcon,
	SendIcon,
	XIcon,
	CheckCircleIcon,
	ClockIcon,
	FileTextIcon,
} from "lucide-react";
import { mockCourses } from "../../data/mockData";

const SubmissionReviewModal = ({ modalState, handleCloseModal, courseId }) => {
	const { assignments, acknowledgments, mockUsers, mockGroups } = useData();

	// Exit early if modal is not open or data is incomplete
	if (!modalState.isOpen || !modalState.assignmentId || !courseId)
		return null;

	const assignment = assignments.find(
		(a) => a.id === modalState.assignmentId
	);
	if (!assignment) return null;

	/**
	 * Builds a list of submission statuses for either students or groups.
	 * Uses memoization to avoid redundant recalculation on re-render.
	 */
	const submissionData = useMemo(() => {
		const course = mockCourses.find((c) => c.id === courseId);
		const studentsInCourse = mockUsers.filter(
			(u) => u.role === "Student" && course?.studentIds.includes(u.id)
		);

		const acksForAssignment = acknowledgments.filter(
			(ack) => ack.assignmentId === modalState.assignmentId
		);

		if (assignment.submissionType === "Individual") {
			return studentsInCourse
				.map((student) => {
					const isSubmitted = acksForAssignment.some(
						(ack) => ack.submitterId === student.id
					);
					return {
						id: student.id,
						name: student.name,
						status: {
							isSubmitted,
							statusText: isSubmitted ? "Submitted" : "Pending",
							className: isSubmitted
								? "badge-success"
								: "badge-warning",
						},
					};
				})
				.sort((a, b) => a.name.localeCompare(b.name));
		}

		// Handle group submission mode
		const courseGroups = mockGroups.filter((g) => g.courseId === courseId);
		const acknowledgedGroupIds = new Set(
			acksForAssignment.map((ack) => ack.submitterId)
		);

		let allMembersStatus = [];

		courseGroups.forEach((group) => {
			const isSubmitted = acknowledgedGroupIds.has(group.id);
			const groupStatus = {
				isSubmitted,
				statusText: isSubmitted ? "Submitted" : "Pending",
				className: isSubmitted ? "badge-success" : "badge-warning",
			};

			group.memberIds.forEach((memberId) => {
				const member = mockUsers.find((u) => u.id === memberId);
				if (member) {
					allMembersStatus.push({
						id: memberId,
						name: `${member.name} (Group ${group.id.slice(0, 4)})`,
						status: groupStatus,
					});
				}
			});
		});

		return allMembersStatus.sort((a, b) => a.name.localeCompare(b.name));
	}, [
		acknowledgments,
		mockUsers,
		mockGroups,
		courseId,
		modalState.assignmentId,
		assignment.submissionType,
	]);

	/**
	 * Calculates summary analytics: total submissions, total entities,
	 * and completion percentage for the progress bar.
	 */
	let totalSubmittable = 0;
	let submittedCount = 0;

	if (assignment.submissionType === "Individual") {
		totalSubmittable = submissionData.length;
		submittedCount = submissionData.filter(
			(s) => s.status.isSubmitted
		).length;
	} else {
		const courseGroups = mockGroups.filter((g) => g.courseId === courseId);
		totalSubmittable = courseGroups.length;

		const acknowledgedGroupIds = new Set(
			acknowledgments
				.filter((ack) => ack.assignmentId === modalState.assignmentId)
				.map((ack) => ack.submitterId)
		);
		submittedCount = courseGroups.filter((g) =>
			acknowledgedGroupIds.has(g.id)
		).length;
	}

	const progressPercentage =
		totalSubmittable > 0
			? Math.round((submittedCount / totalSubmittable) * 100)
			: 0;

	return (
		<div
			className="modal modal-open flex items-center justify-center p-4"
			role="dialog"
			onClick={handleCloseModal}
		>
			<div
				className="modal-box bg-base-100 shadow-2xl border border-base-content/25 rounded-2xl max-w-4xl relative"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={handleCloseModal}
					className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3 text-primary hover:bg-primary/10 transition duration-150"
					aria-label="Close modal"
				>
					<XIcon className="size-5" />
				</button>

				{/* Modal header */}
				<h1
					className="font-bold text-2xl mb-4 text-primary border-b pb-2 border-base-300 pr-10 overflow-hidden whitespace-nowrap truncate"
					title={`Reviewing: ${assignment.title}`}
				>
					Submission Review: {assignment.title}
				</h1>

				{/* Submission analytics summary */}
				<div className="stats stats-vertical md:stats-horizontal shadow w-full rounded-2xl border border-base-content/20 bg-base-100/90 mb-6">
					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-warning">
							<UsersRoundIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							{assignment.submissionType === "Individual"
								? "Total Students"
								: "Total Groups"}
						</div>
						<div className="stat-value text-warning">
							{totalSubmittable}
						</div>
					</div>

					<div className="stat p-4 sm:p-6">
						<div className="stat-figure text-success">
							<SendIcon className="size-6 sm:size-8" />
						</div>
						<div className="stat-title font-semibold text-base sm:text-lg">
							Submissions Received
						</div>
						<div className="stat-value text-success">
							{submittedCount}
						</div>
					</div>

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

				{/* Table of submissions */}
				<h2 className="text-xl font-bold mb-3 text-base-content/90">
					{assignment.submissionType === "Individual"
						? "Individual Student Status"
						: "Group Member Status"}
				</h2>
				<div className="overflow-x-auto max-h-[50vh] overflow-y-auto custom-scrollbar border border-base-content/25 rounded-lg">
					<table className="table w-full bg-base-100">
						<thead>
							<tr className="bg-base-200 sticky top-0 shadow-md text-base-content/90 font-bold py-3">
								<th>#</th>
								<th>
									{assignment.submissionType === "Individual"
										? "Student Name"
										: "Member Name (Group)"}
								</th>
								<th className="text-center">Status</th>
								<th className="text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{submissionData.length > 0 ? (
								submissionData.map((data, index) => (
									<tr
										key={data.id}
										className="hover:bg-base-200/50 transition-colors"
									>
										<td>{index + 1}</td>
										<td className="font-bold text-base-content">
											{data.name}
										</td>
										<td className="text-center">
											<div
												className={`badge ${data.status.className} font-bold`}
											>
												{data.status.isSubmitted ? (
													<CheckCircleIcon className="size-4 mr-1" />
												) : (
													<ClockIcon className="size-4 mr-1" />
												)}
												{data.status.statusText}
											</div>
										</td>
										<td className="text-center">
											<a
												href={
													assignment.oneDriveLink ||
													assignment.driveLink
												}
												target="_blank"
												rel="noopener noreferrer"
												className="btn btn-ghost btn-sm btn-primary tooltip"
												data-tip="View Assignment Files"
											>
												<FileTextIcon className="size-4" />
												<p className="hidden sm:block">
													View
												</p>
											</a>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="4"
										className="text-center py-6 text-base-content/70"
									>
										No students or groups found for this
										course.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Modal close action */}
				<div className="modal-action mt-6">
					<button
						onClick={handleCloseModal}
						className="btn btn-primary"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SubmissionReviewModal;
