/**
 * Displays a modal that allows a student to confirm their final assignment submission.
 * The confirmation is a single-step action, accompanied by a warning notice to ensure
 * the student understands that submission is permanent.
 */

import { AlertTriangleIcon, CheckCircleIcon, XIcon } from "lucide-react";

const SubmissionModal = ({
	modalState,
	handleCloseModal,
	handleFinalConfirmation,
}) => {
	const { isOpen, assignmentTitle } = modalState;

	// Prevent rendering if modal is closed
	if (!isOpen) return null;

	return (
		<dialog
			className={`modal ${
				isOpen ? "modal-open" : ""
			} flex items-center justify-center p-4`}
			open={isOpen}
			onClick={handleCloseModal}
		>
			{/* Modal content container */}
			<div
				className="modal-box bg-base-100 shadow-2xl border border-primary/20 rounded-2xl max-w-lg relative transition-all duration-300 transform"
				onClick={(e) => e.stopPropagation()} // Prevent accidental close when clicking inside
			>
				{/* Close button (top-right corner) */}
				<button
					onClick={handleCloseModal}
					className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3 text-primary hover:bg-primary/10 transition duration-150"
					aria-label="Close modal"
				>
					<XIcon className="size-5" />
				</button>

				{/* Modal header */}
				<h3 className="font-bold text-2xl mb-4 text-primary border-b pb-2 border-base-300">
					Final Submission: {assignmentTitle || "Assignment"}
				</h3>

				{/* Warning message */}
				<div
					role="alert"
					className="alert alert-error border border-error/50 shadow-md text-error-content font-semibold"
				>
					<AlertTriangleIcon className="size-5" />
					<span>
						WARNING: This action is permanent and logs your official
						submission status.
					</span>
				</div>

				{/* Instructional text */}
				<p className="py-4 text-base font-semibold text-base-content">
					By clicking <strong>Confirm Submission</strong>, you certify
					that all required files have been uploaded to the designated
					external link.
				</p>

				{/* Action buttons */}
				<div className="modal-action">
					<button
						onClick={handleCloseModal}
						className="btn btn-ghost"
					>
						Cancel
					</button>
					<button
						onClick={handleFinalConfirmation}
						className="btn btn-success"
					>
						<CheckCircleIcon className="size-5" /> Confirm
						Submission
					</button>
				</div>
			</div>
		</dialog>
	);
};

export default SubmissionModal;
