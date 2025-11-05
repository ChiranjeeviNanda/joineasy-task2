/**
 * Displays all assignments for a specific course in the student's dashboard view.
 * Integrates acknowledgment handling, group management, and submission confirmation workflows.
 * Matches the professor page layout and uses modular components for better clarity and UX consistency.
 */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { mockCourses } from "../../data/mockData";

import AssignmentCard from "../../components/common/AssignmentCard";
import GroupStatusAlert from "../../components/student/GroupStatusAlert";
import GroupManagementModal from "../../components/student/GroupManagementModal";
import SubmissionModal from "../../components/student/SubmissionModal";

import { toast } from "react-hot-toast";
import { ArrowLeftIcon, GraduationCapIcon } from "lucide-react";

const StudentAssignmentsPage = () => {
	const { courseId } = useParams();
	const { user } = useAuth();

	const {
		getAssignmentsByCourse,
		getStudentGroupStatusByCourse,
		acknowledgeSubmission,
		acknowledgments,
	} = useData();

	const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

	// State for controlling the final submission confirmation modal
	const [submissionModalState, setSubmissionModalState] = useState({
		isOpen: false,
		assignmentId: null,
		assignmentTitle: "",
	});

	const course = mockCourses.find((c) => c.id === courseId);
	const courseAssignments = getAssignmentsByCourse(courseId);

	const status = getStudentGroupStatusByCourse(courseId);
	const isGroupLeader = status.isLeader;
	const isPartOfGroup = !!status.groupId;

	// Group metadata passed to subcomponents
	const studentGroupData = {
		groupId: status.groupId,
		memberIds: status.groupMemberIds,
	};

	// Handle missing or invalid course ID
	if (!course) {
		return <div className="alert alert-error">Course not found.</div>;
	}

	/**
	 * Closes the submission confirmation modal and resets its state.
	 */
	const closeSubmissionModal = () => {
		setSubmissionModalState({
			isOpen: false,
			assignmentId: null,
			assignmentTitle: "",
		});
	};

	/**
	 * Opens the submission confirmation modal when a student clicks "Acknowledge Submission."
	 * Validates the selected assignment before opening the modal.
	 */
	const handleAcknowledgeSubmission = (assignmentId) => {
		const assignment = courseAssignments.find((a) => a.id === assignmentId);
		if (!assignment) {
			toast.error("Assignment not found.");
			return;
		}

		setSubmissionModalState({
			isOpen: true,
			assignmentId,
			assignmentTitle: assignment.title,
		});
	};

	/**
	 * Executes the final submission logic after confirmation in the modal.
	 * Delegates actual acknowledgment to the DataContext.
	 */
	const handleFinalConfirmation = () => {
		const assignmentId = submissionModalState.assignmentId;
		const assignment = courseAssignments.find((a) => a.id === assignmentId);

		if (!assignment) {
			toast.error("Assignment not found during final submission.");
			closeSubmissionModal();
			return;
		}

		const submissionSuccessful = acknowledgeSubmission(
			assignment.id,
			assignment.courseId
		);

		if (!submissionSuccessful) {
			toast.error(
				"Submission failed due to status or existing acknowledgment."
			);
		}

		closeSubmissionModal();
	};

	/**
	 * Returns acknowledgment status for each assignment.
	 * Used to determine button visibility and state in AssignmentCard.
	 */
	const getAcknowledgmentStatus = (assignmentId) => {
		const assignment = courseAssignments.find((a) => a.id === assignmentId);
		const targetId =
			assignment?.submissionType === "Individual"
				? user.id
				: studentGroupData?.groupId;

		const acknowledgment = acknowledgments.find(
			(ack) =>
				ack.assignmentId === assignmentId &&
				ack.submitterId === targetId
		);

		if (acknowledgment) {
			return { acknowledged: true, timestamp: acknowledgment.timestamp };
		}
		return { acknowledged: false };
	};

	return (
		<div className="min-h-screen p-4 sm:p-8">
			<div className="max-w-7xl mx-auto space-y-8 pt-20 sm:pt-12">
				{/* Dashboard Header */}
				<header className="p-6 sm:p-8 backdrop-blur-sm rounded-2xl shadow-xl border border-base-content/25">
					<div className="flex items-start justify-between">
						<div className="flex items-start space-x-4">
							{/* Back Button */}
							<Link
								to="/student/dashboard"
								className="btn btn-ghost btn-circle btn-lg text-primary tooltip tooltip-bottom"
								data-tip="Go Back to Dashboard"
							>
								<ArrowLeftIcon className="size-8" />
							</Link>

							{/* Course Title & Info */}
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

				<div className="space-y-8">
					{/* Group Status Banner */}
					<GroupStatusAlert
						courseId={courseId}
						isPartOfGroup={isPartOfGroup}
						isGroupLeader={isGroupLeader}
						onOpenGroupModal={() => setIsGroupModalOpen(true)}
					/>

					{/* Section Header */}
					<div className="flex flex-col sm:flex-row justify-between items-center pb-2 border-b border-base-content/25">
						<h2 className="text-2xl sm:text-3xl font-bold sm:pb-2 text-primary flex items-center">
							<GraduationCapIcon className="size-7 mr-3" /> Your
							Assignments
						</h2>
					</div>

					{/* Assignment List */}
					<div className="space-y-6">
						{courseAssignments.length === 0 ? (
							<div className="text-center p-10 bg-base-100 rounded-xl shadow-lg border border-base-content/25 text-base-content/70">
								<span className="text-lg">
									No assignments have been published for this
									course yet.
								</span>
							</div>
						) : (
							courseAssignments.map((assignment) => {
								const acknowledgmentStatus =
									getAcknowledgmentStatus(assignment.id);
								const isAcknowledged =
									acknowledgmentStatus.acknowledged;
								const isGroupAssignment =
									assignment.submissionType === "Group";

								// Determine acknowledgment rules
								const canAcknowledge =
									!isAcknowledged &&
									(!isGroupAssignment ||
										(isGroupAssignment && isGroupLeader));

								const needsLeaderAck =
									isGroupAssignment &&
									!isGroupLeader &&
									studentGroupData &&
									!isAcknowledged;

								const needsToJoinGroup =
									isGroupAssignment &&
									!studentGroupData.groupId &&
									!isAcknowledged;

								return (
									<AssignmentCard
										key={assignment.id}
										assignment={assignment}
										role="student"
										acknowledgmentStatus={
											acknowledgmentStatus
										}
										canAcknowledge={canAcknowledge}
										needsToJoinGroup={needsToJoinGroup}
										needsLeaderAck={needsLeaderAck}
										onAcknowledge={
											handleAcknowledgeSubmission
										}
									/>
								);
							})
						)}
					</div>

					{/* Group Management Modal */}
					<GroupManagementModal
						courseId={courseId}
						isOpen={isGroupModalOpen}
						onClose={() => setIsGroupModalOpen(false)}
					/>

					{/* Final Submission Confirmation Modal */}
					<SubmissionModal
						modalState={submissionModalState}
						handleCloseModal={closeSubmissionModal}
						handleFinalConfirmation={handleFinalConfirmation}
					/>
				</div>
			</div>
		</div>
	);
};

export default StudentAssignmentsPage;
