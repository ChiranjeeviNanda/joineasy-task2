/**
 * Modal for creating or editing assignments within a course.
 * Supports form fields for title, description, deadline, OneDrive link,
 * and submission type (Individual or Group).
 */

import { useState, useEffect } from "react";
import FormInput from "../common/FormInput";
import {
	PencilLineIcon,
	CalendarCheckIcon,
	LinkIcon,
	AlignLeftIcon,
	UsersRoundIcon,
	UserRoundIcon,
	XIcon,
} from "lucide-react";

const CreateAssignmentModal = ({
	isOpen,
	onClose,
	onSave,
	initialData,
	courseId,
}) => {
	const isEditing = !!initialData;
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		deadline: "",
		oneDriveLink: "",
		submissionType: "Individual",
	});

	// Populate form when editing or reset for new assignment
	useEffect(() => {
		if (isEditing) {
			setFormData({
				...initialData,
				deadline: initialData.deadline
					? new Date(initialData.deadline).toISOString().slice(0, 16)
					: "",
			});
		} else {
			setFormData({
				title: "",
				description: "",
				deadline: "",
				oneDriveLink: "",
				submissionType: "Individual",
			});
		}
	}, [isEditing, initialData]);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		const dataToSave = {
			...formData,
			id: isEditing
				? initialData.id
				: Math.random().toString(36).substring(2, 9),
			courseId,
			deadline: new Date(formData.deadline).toISOString(),
		};
		onSave(dataToSave);
	};

	if (!isOpen) return null;

	return (
		<dialog
			id="assignment_modal"
			className={`modal ${isOpen ? "modal-open" : ""}`}
		>
			<div className="modal-box max-w-2xl bg-base-100 rounded-2xl shadow-2xl border border-base-content/25">
				{/* Close button */}
				<button
					onClick={onClose}
					className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3 text-primary hover:bg-primary/10 transition-all duration-150"
					aria-label="Close modal"
				>
					<XIcon className="size-5" />
				</button>

				{/* Modal title */}
				<h3 className="font-bold text-2xl mb-6 text-primary flex items-center gap-2">
					<PencilLineIcon className="size-6" />
					{isEditing ? "Edit Assignment" : "Create New Assignment"}
				</h3>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-3">
					{/* Title */}
					<FormInput
						id="title"
						label="Assignment Title"
						type="text"
						placeholder="e.g., Final Project Report"
						value={formData.title}
						onChange={handleChange}
						icon={PencilLineIcon}
						name="title"
					/>

					{/* Description */}
					<div className="form-control">
						<label className="label pb-1" htmlFor="description">
							<span className="label-text text-base font-semibold text-base-content/90">
								Description
							</span>
						</label>
						<div className="relative">
							<AlignLeftIcon className="absolute top-4 left-4 size-5 text-primary/70 z-10" />
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								className="textarea textarea-bordered h-24 w-full pt-4 pb-4 pl-12 rounded-2xl transition-all duration-150 focus:scale-[1.01] focus:shadow-md border-2 hover:border-primary/50 focus:border-primary"
								placeholder="Provide a detailed description of the assignment."
								required
							></textarea>
						</div>
					</div>

					{/* Deadline */}
					<FormInput
						id="deadline"
						label="Deadline (Date & Time)"
						type="datetime-local"
						value={formData.deadline}
						onChange={handleChange}
						icon={CalendarCheckIcon}
						name="deadline"
					/>

					{/* OneDrive Link */}
					<FormInput
						id="oneDriveLink"
						label="OneDrive Link (for resources/submission)"
						type="url"
						placeholder="https://onedrive.live.com/..."
						value={formData.oneDriveLink}
						onChange={handleChange}
						icon={LinkIcon}
						name="oneDriveLink"
					/>

					{/* Submission Type */}
					<div className="form-control mb-8">
						<label className="label pb-1">
							<span className="label-text text-base font-semibold text-base-content/90">
								Submission Type
							</span>
						</label>
						<div className="flex gap-6 pt-1">
							<label className="flex items-center gap-3 cursor-pointer">
								<input
									type="radio"
									name="submissionType"
									value="Individual"
									checked={
										formData.submissionType === "Individual"
									}
									onChange={handleChange}
									className="radio radio-primary radio-lg"
								/>
								<div className="flex items-center gap-1 text-base font-medium">
									<UserRoundIcon className="size-5 text-primary/80" />
									Individual
								</div>
							</label>

							<label className="flex items-center gap-3 cursor-pointer">
								<input
									type="radio"
									name="submissionType"
									value="Group"
									checked={
										formData.submissionType === "Group"
									}
									onChange={handleChange}
									className="radio radio-primary radio-lg"
								/>
								<div className="flex items-center gap-1 text-base font-medium">
									<UsersRoundIcon className="size-5 text-primary/80" />
									Group
								</div>
							</label>
						</div>
					</div>

					{/* Action buttons */}
					<div className="modal-action mt-4 pt-4 border-t border-base-content/25 flex justify-end space-x-3">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary font-semibold"
						>
							{isEditing ? "Save Changes" : "Create Assignment"}
						</button>
					</div>
				</form>
			</div>
		</dialog>
	);
};

export default CreateAssignmentModal;
