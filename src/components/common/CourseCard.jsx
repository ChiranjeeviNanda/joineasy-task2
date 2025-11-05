/**
 * Displays key information about a course, including enrolled students,
 * assignment count, and instructor (if applicable).
 * The layout and actions adapt based on the user's role (Professor or Student).
 */

import { Link } from "react-router-dom";
import {
	UsersRoundIcon,
	BookOpenIcon,
	GraduationCapIcon,
	FileTextIcon,
	ArrowRightIcon,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";

const CourseCard = ({ course, role }) => {
	const { assignments, getProfessorNameById } = useData();

	// Derive the number of assignments and professor name for this course
	const assignmentCount = assignments.filter(
		(a) => a.courseId === course.id
	).length;
	const professorName = getProfessorNameById(course.professorId);

	// Determine navigation and button behavior based on role
	const coursePath =
		role === "Professor"
			? `/professor/courses/${course.id}/assignments`
			: `/student/courses/${course.id}/assignments`;

	const buttonText =
		role === "Professor" ? "Manage Assignments" : "View Assignments";
	const buttonAriaLabel =
		role === "Professor"
			? `Manage Assignments for ${course.name}`
			: `View Assignments for ${course.name}`;

	return (
		<div className="card w-full shadow-md border border-base-content/25 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out rounded-2xl flex flex-col h-full">
			<div className="card-body p-8 flex flex-col justify-between h-full">
				{/* Header: Course ID, Name, and Professor Info */}
				<div className="mb-4">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-primary/10 rounded-full">
							<BookOpenIcon className="size-5 text-primary" />
						</div>
						<div className="badge badge-outline badge-sm text-primary border-primary/50 font-medium tracking-wide">
							{course.id}
						</div>
					</div>

					<h2 className="card-title text-3xl font-extrabold text-primary leading-snug max-h-24 overflow-y-auto pr-2">
						{course.name}
					</h2>

					{role === "Student" && (
						<div className="flex items-center mt-3">
							<GraduationCapIcon className="size-4 mr-2 text-primary" />
							<p className="text-sm font-medium text-base-content">
								Professor:{" "}
								<span className="font-semibold">
									{professorName}
								</span>
							</p>
						</div>
					)}
				</div>

				{/* Metadata: Enrolled students and assignments */}
				<div className="flex flex-col text-sm space-y-4 pt-4 border-t border-base-content/25">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<UsersRoundIcon className="size-4 mr-2 text-warning" />
							<span className="font-medium">
								Enrolled Students:
							</span>
						</div>
						<p className="font-extrabold text-base-content text-lg ml-2">
							{course.studentIds.length}
						</p>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<FileTextIcon className="size-4 mr-2 text-success" />
							<span className="font-medium">
								Total Assignments:
							</span>
						</div>
						<p className="font-extrabold text-base-content text-lg ml-2">
							{assignmentCount}
						</p>
					</div>
				</div>

				{/* Action Button */}
				<div className="card-actions justify-start mt-4">
					<Link
						to={coursePath}
						className="btn btn-primary btn-block font-semibold"
						aria-label={buttonAriaLabel}
					>
						{buttonText}
						<ArrowRightIcon className="size-4 ml-2" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
