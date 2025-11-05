/**
 * Displays detailed information about an assignment, including
 * metadata, submission type, resource links, and actions based on the user role.
 * - For students: shows acknowledgment and group-related actions.
 * - For professors: provides edit, delete, and review controls.
 */

import dayjs from "dayjs";
import { ClockIcon, LinkIcon, FileTextIcon } from "lucide-react";
import ProfessorAssignmentActions from "../professor/ProfessorAssignmentActions";
import StudentAssignmentActions from "../student/StudentAssignmentActions";

const AssignmentCard = ({
	assignment,
	role = "student",
	acknowledgmentStatus,
	analytics,
	canAcknowledge,
	needsToJoinGroup,
	needsLeaderAck,
	onAcknowledge,
	onEdit,
	onDelete,
	onReview,
}) => {
	const borderColor = "border border-base-content/25 hover:border-primary/60";

	// Renders the appropriate action panel depending on user role
	const ActionsStatusPanel = (
		<div className="flex flex-col gap-6 w-full">
			{role === "student" ? (
				<StudentAssignmentActions
					assignmentId={assignment.id}
					acknowledgmentStatus={acknowledgmentStatus}
					canAcknowledge={canAcknowledge}
					needsToJoinGroup={needsToJoinGroup}
					needsLeaderAck={needsLeaderAck}
					onAcknowledge={onAcknowledge}
				/>
			) : (
				<ProfessorAssignmentActions
					assignment={assignment}
					analytics={analytics}
					onEdit={onEdit}
					onDelete={onDelete}
					onReview={onReview}
				/>
			)}
		</div>
	);

	return (
		<div
			key={assignment.id}
			className={`card w-full shadow-xl ${borderColor} transition-all duration-300 ease-in-out rounded-2xl flex flex-col h-full`}
		>
			<div className="card-body p-6 sm:p-8 flex flex-col justify-between h-full">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column: Assignment Info */}
					<div className="lg:col-span-2 flex flex-col">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-primary/10 rounded-full">
								<FileTextIcon className="size-6 text-primary" />
							</div>
							<div className="badge badge-primary text-sm font-bold tracking-wide py-3">
								{assignment.submissionType}
							</div>
						</div>

						<h2 className="card-title text-2xl sm:text-3xl font-extrabold text-primary leading-snug max-h-24 overflow-y-auto pr-2 mb-2">
							{assignment.title}
						</h2>

						<p className="opacity-80 text-base mb-2">
							{assignment.description}
						</p>

						{/* Assignment Details */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Deadline */}
							<div className="flex items-start gap-4 pt-4 sm:pt-0">
								<ClockIcon className="size-6 text-warning" />
								<div>
									<span className="block font-bold opacity-80 mb-0.5 text-sm">
										Deadline
									</span>
									<span className="font-semibold text-base-content text-lg">
										{dayjs(assignment.deadline).format(
											"MMM D, YYYY h:mm A"
										)}
									</span>
								</div>
							</div>

							{/* Resource Link */}
							<div className="flex items-start gap-4">
								<LinkIcon className="size-6 text-primary" />
								<div>
									<span className="block font-bold opacity-80 mb-0.5 text-sm">
										Resource Folder
									</span>
									<a
										href={assignment.oneDriveLink}
										target="_blank"
										rel="noopener noreferrer"
										className="link link-hover link-primary font-semibold text-lg"
									>
										OneDrive
									</a>
								</div>
							</div>
						</div>

						{/* Mobile Actions (below Details) */}
						<div className="lg:hidden mt-4 border-t border-base-content/25 pt-4">
							{ActionsStatusPanel}
						</div>
					</div>

					{/* Right Column: Actions (Sidebar) */}
					<div className="hidden lg:col-span-1 lg:block lg:border-l lg:border-base-content/25 lg:pl-8 lg:pt-4">
						{ActionsStatusPanel}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssignmentCard;
