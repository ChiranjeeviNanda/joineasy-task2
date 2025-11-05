/**
 * Manages all assignments for a specific course in the professor’s dashboard.
 * Allows creation, editing, deletion, and review of assignments, while displaying
 * submission progress analytics for both individual and group submissions.
 */

import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
	mockCourses,
	mockAcknowledgments,
	mockGroups,
} from "../../data/mockData";

import { useData } from "../../contexts/DataContext";
import CreateAssignmentModal from "../../components/professor/CreateAssignmentModal";
import SubmissionReviewModal from "../../components/professor/SubmissionReviewModal";
import AssignmentCard from "../../components/common/AssignmentCard";

import { PlusCircle, ArrowLeftIcon, ClipboardListIcon } from "lucide-react";

const AssignmentManagementPage = () => {
	const { courseId } = useParams();
	const { assignments, createOrUpdateAssignment, deleteAssignment } =
		useData();

	// Retrieve course details using the ID from route params
	const course = mockCourses.find((c) => c.id === courseId);

	// Modal and editing states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAssignment, setEditingAssignment] = useState(null);
	const [reviewModalState, setReviewModalState] = useState({
		isOpen: false,
		assignmentId: null,
		submissionType: null,
	});

	// Compute enriched assignment data with submission analytics
	const courseAssignments = useMemo(() => {
		const studentIdsInCourse = course?.studentIds || [];
		const courseGroups = mockGroups.filter((g) => g.courseId === courseId);

		const enrichedAssignments = assignments
			.filter((a) => a.courseId === courseId)
			.map((assignment) => {
				let totalSubmittable = 0;
				let submittedCount = 0;

				// Handle individual vs group submission logic
				if (assignment.submissionType === "Individual") {
					totalSubmittable = studentIdsInCourse.length;
					submittedCount = mockAcknowledgments.filter(
						(ack) =>
							ack.assignmentId === assignment.id &&
							studentIdsInCourse.includes(ack.submitterId)
					).length;
				} else {
					totalSubmittable = courseGroups.length;
					submittedCount = mockAcknowledgments.filter(
						(ack) =>
							ack.assignmentId === assignment.id &&
							courseGroups.some((g) => g.id === ack.submitterId)
					).length;
				}

				const percentage =
					totalSubmittable > 0
						? (submittedCount / totalSubmittable) * 100
						: 0;

				return {
					...assignment,
					totalSubmittable,
					submittedCount,
					submissionPercentage: Math.round(percentage),
				};
			});

		// Sort newest assignments first
		return enrichedAssignments.sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);
	}, [courseId, course, assignments]);

	// Modal handlers
	const handleCreateAssignment = () => {
		setEditingAssignment(null);
		setIsModalOpen(true);
	};

	const handleEditAssignment = (assignment) => {
		setEditingAssignment(assignment);
		setIsModalOpen(true);
	};

	const handleSaveAssignment = (assignmentData) => {
		createOrUpdateAssignment(assignmentData);
		setIsModalOpen(false);
	};

	const handleDeleteAssignment = (assignmentId) => {
		if (
			window.confirm("Are you sure you want to delete this assignment?")
		) {
			deleteAssignment(assignmentId);
		}
	};

	// Review modal control
	const handleOpenReview = (assignment) => {
		setReviewModalState({
			isOpen: true,
			assignmentId: assignment.id,
			submissionType: assignment.submissionType,
		});
	};

	const handleCloseReview = () => {
		setReviewModalState({
			isOpen: false,
			assignmentId: null,
			submissionType: null,
		});
	};

	// Helper for retrieving analytics data for the AssignmentCard
	const getAnalyticsForAssignment = (assignment) => {
		const enhanced = courseAssignments.find((a) => a.id === assignment.id);
		if (!enhanced)
			return { submittedCount: 0, totalSubmittable: 0, percentage: 0 };
		return {
			submittedCount: enhanced.submittedCount,
			totalSubmittable: enhanced.totalSubmittable,
			percentage: enhanced.submissionPercentage,
		};
	};

	// If no matching course found, show fallback message
	if (!course) {
		return (
			<div className="text-center p-10 text-error font-bold">
				Course Not Found.
			</div>
		);
	}

	return (
		<div className="min-h-screen p-4 sm:p-8">
			<div className="max-w-7xl mx-auto space-y-8 pt-20 sm:pt-12">
				{/* Header Section */}
				<header className="p-6 sm:p-8 backdrop-blur-sm rounded-2xl shadow-xl border border-base-content/25">
					<div className="flex items-start justify-between">
						<div className="flex items-start space-x-4">
							<Link
								to="/professor/dashboard"
								className="btn btn-ghost btn-circle btn-lg text-primary tooltip tooltip-bottom"
								data-tip="Go Back to Dashboard"
							>
								<ArrowLeftIcon className="size-8" />
							</Link>
							<div>
								<h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
									{course.name}
								</h1>
								<p className="badge badge-outline badge-sm sm:badge-lg text-primary border-primary/50 font-medium tracking-wide">
									Course ID: {course.id}
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Assignment Management Section */}
				<div className="space-y-8">
					<div className="flex flex-col sm:flex-row justify-between items-center pb-2 border-b border-base-content/25">
						<h2 className="text-2xl sm:text-3xl font-bold sm:pb-2 text-primary flex items-center">
							<ClipboardListIcon className="size-7 mr-3" /> My
							Assignment List
						</h2>
						<button
							onClick={handleCreateAssignment}
							className="btn btn-primary w-full sm:w-auto font-semibold m-4 sm:m-0"
						>
							<PlusCircle className="size-5" /> Create New
							Assignment
						</button>
					</div>

					{/* Assignment List Display */}
					<div className="space-y-6">
						{courseAssignments.length === 0 ? (
							<div className="text-center p-10 bg-base-100 rounded-xl shadow-lg border border-base-content/25 text-base-content/70">
								<span className="text-lg">
									You have not created any assignments yet.
									Click{" "}
									<p className="font-bold">
										Create New Assignment
									</p>{" "}
									to publish your first task!
								</span>
							</div>
						) : (
							courseAssignments.map((assignment) => (
								<AssignmentCard
									key={assignment.id}
									assignment={assignment}
									role="professor"
									analytics={getAnalyticsForAssignment(
										assignment
									)}
									onEdit={handleEditAssignment}
									onDelete={handleDeleteAssignment}
									onReview={handleOpenReview}
								/>
							))
						)}
					</div>

					{/* Modals */}
					<CreateAssignmentModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onSave={handleSaveAssignment}
						initialData={editingAssignment}
						courseId={courseId}
					/>
					<SubmissionReviewModal
						modalState={reviewModalState}
						handleCloseModal={handleCloseReview}
						courseId={courseId}
					/>
				</div>
			</div>
		</div>
	);
};

export default AssignmentManagementPage;
