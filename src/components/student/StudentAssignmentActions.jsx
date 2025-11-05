/**
 * Displays the acknowledgment status and actions for a student’s assignment.
 * Handles dynamic button states and contextual messages based on submission
 * eligibility, group participation, and acknowledgment status.
 */

import dayjs from "dayjs";
import { CheckCircleIcon } from "lucide-react";

const StudentAssignmentActions = ({
	assignmentId,
	acknowledgmentStatus,
	canAcknowledge,
	needsToJoinGroup,
	needsLeaderAck,
	onAcknowledge,
}) => {
	const { acknowledged, timestamp } = acknowledgmentStatus || {};

	// Initialize button and helper text defaults
	let buttonText = "Confirm Submission";
	let buttonColor = "btn-primary";
	let isButtonDisabled = !canAcknowledge || acknowledged;
	let helperText = null;

	// Determine button label, color, and state based on current context
	if (acknowledged) {
		buttonText = "Submission Confirmed";
		buttonColor = "btn-disabled";
		isButtonDisabled = true;
	} else if (needsToJoinGroup) {
		buttonText = "Join Group to Submit";
		buttonColor = "btn-warning";
		isButtonDisabled = true;
		helperText = "Please enroll in a group first.";
	} else if (needsLeaderAck) {
		buttonText = "Waiting for Group Leader";
		buttonColor = "btn-info";
		isButtonDisabled = true;
		helperText = "Group leader must confirm submission.";
	}

	return (
		<div className="flex flex-col gap-4 w-full h-full justify-end">
			{/* Acknowledgment Status - Shown at all times */}
			<div
				className={`alert ${
					acknowledged ? "alert-success" : "alert-warning"
				} p-4 shadow-lg`}
			>
				<CheckCircleIcon className="size-5" />
				<div className="flex flex-col">
					<h4 className="font-bold text-lg">
						{acknowledged
							? "Assignment Acknowledged"
							: "Submission Pending"}
					</h4>
					<span className="text-sm opacity-90">
						{acknowledged
							? `Submitted on ${dayjs(timestamp).format(
									"MMM D, h:mm A"
							  )}`
							: "Acknowledge when complete."}
					</span>
				</div>
			</div>

			{/* Acknowledgment Action - Primary button */}
			<div className="flex-none pt-2">
				<button
					className={`btn ${buttonColor} btn-lg btn-block font-semibold`}
					onClick={() => onAcknowledge(assignmentId)}
					disabled={isButtonDisabled}
				>
					{buttonText}
				</button>

				{/* Optional helper message for restricted actions */}
				{helperText && (
					<p className="text-center text-sm mt-2 text-base-content opacity-70">
						{helperText}
					</p>
				)}
			</div>
		</div>
	);
};

export default StudentAssignmentActions;
