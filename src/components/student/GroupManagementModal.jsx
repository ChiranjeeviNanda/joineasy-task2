/**
 * Modal for students to manage their group participation within a course.
 * Allows creating a new group (becoming leader) or joining an existing one,
 * ensuring groups are limited to 5 members.
 */

import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { UsersIcon, XIcon } from "lucide-react";

const GroupManagementModal = ({ courseId, isOpen, onClose }) => {
	const { groups, createOrJoinGroup } = useData();
	const [selectedGroupId, setSelectedGroupId] = useState("");

	// Filter available groups: only those for this course and not full (max 5 members)
	const availableGroups = groups.filter(
		(g) => g.courseId === courseId && g.memberIds.length < 5
	);

	// Handle creating a new group for the current course
	const handleCreateGroup = () => {
		createOrJoinGroup(courseId, "create");
		onClose();
	};

	// Handle joining a selected existing group
	const handleJoinGroup = () => {
		if (selectedGroupId) {
			createOrJoinGroup(courseId, "join", selectedGroupId);
			onClose();
		} else {
			alert("Please select a group to join."); // Temporary fallback (toast preferred)
		}
	};

	// Don’t render anything when modal is closed
	if (!isOpen) return null;

	return (
		<dialog
			id="group_modal"
			className={`modal ${isOpen ? "modal-open" : ""}`}
		>
			<div className="modal-box max-w-lg bg-base-100 rounded-2xl shadow-2xl border border-base-content/25">
				{/* Close button (top-right) */}
				<button
					onClick={onClose}
					className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3 text-primary hover:bg-primary/10 transition-all duration-150"
					aria-label="Close modal"
				>
					<XIcon className="size-5" />
				</button>

				{/* Modal title */}
				<h3 className="font-bold text-2xl mb-6 text-primary flex items-center gap-2">
					<UsersIcon className="size-6" />
					Manage Your Course Group
				</h3>

				<p className="pb-4 text-base-content/80">
					You need to be in a group for group assignments in this
					course.
				</p>

				{/* Group management actions */}
				<div className="flex flex-col gap-4 mt-2">
					{/* Create new group */}
					<button
						className="btn btn-warning font-semibold"
						onClick={handleCreateGroup}
					>
						Create New Group (Become Leader)
					</button>

					<div className="divider text-base-content/60">OR</div>

					{/* Join existing group */}
					<select
						className="select select-bordered w-full rounded-xl transition-all duration-150 hover:border-primary/50 focus:border-primary"
						value={selectedGroupId}
						onChange={(e) => setSelectedGroupId(e.target.value)}
					>
						<option value="" disabled>
							Select a Group to Join
						</option>
						{availableGroups.map((g) => (
							<option key={g.id} value={g.id}>
								Group {g.id} ({g.memberIds.length} / 5 members)
							</option>
						))}
					</select>

					<button
						className="btn btn-primary font-semibold"
						onClick={handleJoinGroup}
						disabled={!selectedGroupId}
					>
						Join Selected Group
					</button>
				</div>
			</div>
		</dialog>
	);
};

export default GroupManagementModal;
