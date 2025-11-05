/**
 * Displays submission analytics and provides quick management actions
 * (review, edit, delete) for a professor’s assignment card.
 */

import { PencilIcon, TrashIcon, EyeIcon } from "lucide-react";

const ProfessorAssignmentActions = ({
	assignment,
	analytics,
	onEdit,
	onDelete,
	onReview,
}) => {
	const { submittedCount, totalSubmittable, percentage } = analytics || {
		submittedCount: 0,
		totalSubmittable: 0,
		percentage: 0,
	};

	// Determine progress color based on submission completion percentage
	const progressColor =
		percentage < 50
			? "progress-warning"
			: percentage < 100
			? "progress-primary"
			: "progress-success";

	return (
		<div className="flex flex-col gap-4 w-full h-full">
			{/* Submission analytics */}
			<div className="text-sm font-medium flex items-center justify-between mb-1">
				<span>
					<span className="font-extrabold text-xl mr-1">
						{submittedCount}
					</span>
					/<span className="opacity-80">{totalSubmittable}</span>{" "}
					Submissions
				</span>
				<span className="font-extrabold text-xl">{percentage}%</span>
			</div>

			{/* Progress bar */}
			<progress
				className={`progress ${progressColor} w-full`}
				value={percentage}
				max="100"
			></progress>

			{/* Action buttons */}
			<div className="flex-end w-full flex flex-col gap-3 mt-2">
				<button
					className="btn btn-primary w-full font-semibold"
					onClick={() => onReview(assignment)}
				>
					<EyeIcon className="size-5" /> Review Submissions
				</button>

				<div className="flex justify-end gap-3">
					<button
						className="btn btn-info lg:btn-outline font-bold flex-1"
						onClick={() => onEdit(assignment)}
					>
						<PencilIcon className="size-4" /> Edit
					</button>
					<button
						className="btn btn-error lg:btn-outline font-bold flex-1"
						onClick={() => onDelete(assignment.id)}
					>
						<TrashIcon className="size-4" /> Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfessorAssignmentActions;
