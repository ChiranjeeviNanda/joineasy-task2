import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
// FIX: We import mock data directly to simulate backend data access
import {
	mockCourses,
	// mockAssignments, // Removed unnecessary import
	mockAcknowledgments,
	mockGroups,
} from "../../data/mockData";

// Import the actual components we created
import CreateAssignmentModal from "../../components/professor/CreateAssignmentModal";
// REMOVED: import ProfessorAssignmentList from "../../components/professor/ProfessorAssignmentList";
// NEW: Import the common card component
import AssignmentCard from "../../components/common/AssignmentCard";

// Icons Imports
import { PlusCircle, ArrowLeftIcon, ClipboardListIcon } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import SubmissionReviewModal from "../../components/professor/SubmissionReviewModal";

const AssignmentManagementPage = () => {
	const { courseId } = useParams();
	const {
		assignments,
		createOrUpdateAssignment, // <-- Renamed function
		deleteAssignment,
	} = useData();
	// Using mockCourses as done in the original file
	const course = mockCourses.find((c) => c.id === courseId);

	/** Modal States */
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAssignment, setEditingAssignment] = useState(null);
	const [reviewModalState, setReviewModalState] = useState({
		isOpen: false,
		assignmentId: null,
		submissionType: null, // Track submission type for group/individual logic
	});

	/** Data Filtering and Enrichment - Calculation moved inside useMemo */
	const courseAssignments = useMemo(() => {
		const studentIdsInCourse = course?.studentIds || [];
		const courseGroups = mockGroups.filter((g) => g.courseId === courseId);

		const enrichedAssignments = assignments
			.filter((a) => a.courseId === courseId)
			.map((assignment) => {
				let totalSubmittable = 0;
				let submittedCount = 0;

				if (assignment.submissionType === "Individual") {
					totalSubmittable = studentIdsInCourse.length;

					submittedCount = mockAcknowledgments.filter(
						(ack) =>
							ack.assignmentId === assignment.id &&
							studentIdsInCourse.includes(ack.submitterId)
					).length;
				} else {
					// Group Submission
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
					totalSubmittable: totalSubmittable,
					submittedCount: submittedCount,
					submissionPercentage: Math.round(percentage),
				};
			});

		// ⭐ NEW: Sort the assignments to display the newest ones first
		// Assuming assignments have a 'createdAt' property that is a valid date string or Date object.
		return enrichedAssignments.sort((a, b) => {
			// Convert to Date objects for comparison
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);
			// Sort in descending order (newest first)
			return dateB.getTime() - dateA.getTime();
		});
	}, [courseId, course, assignments]);

	/** Modal Handlers & CRUD Stubs (Passing down to AssignmentCard) */
	const handleCreateAssignment = () => {
		setEditingAssignment(null);
		setIsModalOpen(true);
	};

	const handleEditAssignment = (assignment) => {
		setEditingAssignment(assignment);
		setIsModalOpen(true);
	};

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

	// Helper function to extract analytics for the Card component
	const getAnalyticsForAssignment = (assignment) => {
		// Find the enhanced assignment data calculated in useMemo
		const enhancedAssignment = courseAssignments.find(
			(a) => a.id === assignment.id
		);
		if (!enhancedAssignment)
			return { submittedCount: 0, totalSubmittable: 0, percentage: 0 };

		return {
			submittedCount: enhancedAssignment.submittedCount,
			totalSubmittable: enhancedAssignment.totalSubmittable,
			percentage: enhancedAssignment.submissionPercentage,
		};
	};

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
				{/* 1. Header and Back Button */}
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

					{/* 3. Assignment List (Now using AssignmentCard and map) */}
					<div className="space-y-6">
						{" "}
						{/* Matches the outer div of the old ProfessorAssignmentList */}
						{courseAssignments.length === 0 ? (
							<div className="text-center p-10 bg-base-100 rounded-xl shadow-lg border border-base-content/25 text-base-content/70">
								<span className="text-lg">
									You have not created any assignments yet.
									Click{" "}
									<p className="font-bold">
										Create New Assignment
									</p>{" "}
									above to publish your first task!
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
					{/* 4. Modal Layer */}
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
