/**
 * Displays a contextual alert showing the student’s group status within a course.
 * The alert changes based on whether the student is in a group and whether they are the leader,
 * and provides a quick action to manage or join groups when required.
 */

import {
	AlertCircleIcon,
	CheckCircleIcon,
	UsersRoundIcon,
} from "lucide-react";

const GroupStatusAlert = ({
	isPartOfGroup,
	isGroupLeader,
	onOpenGroupModal,
}) => {
	/**
	 * Renders a standardized alert with an icon, title, and description.
	 * Optionally includes an action button (e.g., "Manage Group").
	 */
	const renderAlertContent = (
		IconComponent,
		title,
		text,
		className,
		actionButton = null
	) => (
		<div
			role="alert"
			className={`alert ${className} mb-6 shadow-lg p-4 ${
				actionButton ? "flex justify-between items-center" : ""
			}`}
		>
			<div className="flex items-center gap-4">
				<IconComponent className="size-6 flex-none" />
				<div className="flex flex-col">
					<h4 className="font-bold text-lg">{title}</h4>
					<p className="text-sm opacity-90">{text}</p>
				</div>
			</div>
			{actionButton}
		</div>
	);

	// Scenario 1: Not in any group (Warning)
	if (!isPartOfGroup) {
		const actionButton = (
			<button
				className="btn btn-md btn-neutral btn-ghost ml-4 flex-none font-semibold"
				onClick={onOpenGroupModal}
			>
				Manage Group
			</button>
		);

		return renderAlertContent(
			AlertCircleIcon,
			"Group Required!",
			"You are not part of any group for this course. You must join or create a group to acknowledge group assignments.",
			"alert-warning",
			actionButton
		);
	}

	// Scenario 2: Member, not leader (Informational)
	if (isPartOfGroup && !isGroupLeader) {
		return renderAlertContent(
			UsersRoundIcon,
			"Group Member",
			"You are a Group Member. Your Group Leader will handle the final submission acknowledgment.",
			"alert-info"
		);
	}

	// Scenario 3: Group leader (Success)
	if (isPartOfGroup && isGroupLeader) {
		return renderAlertContent(
			CheckCircleIcon,
			"Group Leader",
			"You are the Group Leader. You are responsible for acknowledging group submissions.",
			"alert-success"
		);
	}

	return null;
};

export default GroupStatusAlert;
