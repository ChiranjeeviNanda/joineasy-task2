/**
 * Global data context for managing mock academic data.
 * Handles courses, assignments, groups, and acknowledgments
 * for both students and professors using React Context.
 * Provides data retrieval and update utilities across the application.
 */

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
} from "react";
import {
	mockCourses,
	mockAssignments as initialMockAssignments,
	mockGroups,
	mockUsers,
	mockAcknowledgments,
	generateId,
} from "../data/mockData";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const DataContext = createContext();

/**
 * Hook for accessing shared data and utility functions across the app.
 */
export const useData = () => useContext(DataContext);

/**
 * Provides global data management for mock courses, assignments, groups,
 * and submission acknowledgments. Handles both student and professor logic.
 */
export const DataProvider = ({ children }) => {
	const { user } = useAuth();

	const [assignments, setAssignments] = useState(initialMockAssignments);
	const [acknowledgments, setAcknowledgments] = useState(mockAcknowledgments);
	const [groups, setGroups] = useState(mockGroups);

	/** Returns the list of courses assigned to the current user. */
	const getUserCourses = useMemo(() => {
		if (!user) return [];
		return mockCourses.filter((c) => user.courseIds.includes(c.id));
	}, [user]);

	/** Returns all assignments belonging to a specific course. */
	const getAssignmentsByCourse = useCallback(
		(courseId) => assignments.filter((a) => a.courseId === courseId),
		[assignments]
	);

	/** Returns a professor’s display name based on their user ID. */
	const getProfessorNameById = useCallback((professorId) => {
		const professor = mockUsers.find(
			(u) => u.id === professorId && u.role === "Professor"
		);
		return professor ? professor.name : "Professor Unknown";
	}, []);

	/** Returns group status information for the logged-in student. */
	const getStudentGroupStatusByCourse = useCallback(
		(courseId) => {
			if (user?.role !== "Student") return {};

			const group = groups.find(
				(g) => g.courseId === courseId && g.memberIds.includes(user.id)
			);

			return {
				isNotInGroup: !group,
				isLeader: group && group.leaderId === user.id,
				groupId: group?.id,
				groupMemberIds: group?.memberIds || [],
			};
		},
		[user, groups]
	);

	/**
	 * Records a student's or group's submission acknowledgment for a specific assignment.
	 * Prevents duplicate submissions and updates acknowledgment state.
	 */
	const acknowledgeSubmission = useCallback(
		(assignmentId, courseId) => {
			if (!user || user.role !== "Student") return false;

			const assignment = getAssignmentsByCourse(courseId).find(
				(a) => a.id === assignmentId
			);
			if (!assignment) return false;

			const now = new Date().toISOString();
			let submitterId = user.id;

			if (assignment.submissionType === "Group") {
				const status = getStudentGroupStatusByCourse(courseId);
				if (!status.groupId) {
					console.error("Not in a group for this assignment.");
					return false;
				}
				if (!status.isLeader) {
					console.error("Only the group leader can submit.");
					return false;
				}
				submitterId = status.groupId;
			}

			const alreadyAcknowledged = acknowledgments.some(
				(ack) =>
					ack.assignmentId === assignmentId &&
					ack.submitterId === submitterId
			);
			if (alreadyAcknowledged) {
				toast.error("This submission was already acknowledged.");
				return true;
			}

			const newAcknowledgment = {
				id: generateId(),
				assignmentId,
				submitterId,
				acknowledged: true,
				timestamp: now,
			};

			setAcknowledgments((prev) => [...prev, newAcknowledgment]);
			toast.success("Submission acknowledged successfully!");
			return true;
		},
		[
			user,
			acknowledgments,
			getAssignmentsByCourse,
			getStudentGroupStatusByCourse,
		]
	);

	/**
	 * Allows professors to create or update assignments.
	 * Automatically generates IDs and timestamps for new ones.
	 */
	const createOrUpdateAssignment = useCallback(
		(assignmentData) => {
			const existing = assignments.find(
				(a) => a.id === assignmentData.id
			);

			setAssignments((prev) => {
				if (existing) {
					toast.success(
						`Assignment "${assignmentData.title}" updated.`
					);
					return prev.map((a) =>
						a.id === assignmentData.id
							? { ...assignmentData, createdAt: a.createdAt }
							: a
					);
				} else {
					const newAssignment = {
						...assignmentData,
						id: generateId(),
						submissions: [],
						createdAt: new Date().toISOString(),
					};
					toast.success(
						`Assignment "${assignmentData.title}" created!`
					);
					return [...prev, newAssignment];
				}
			});
		},
		[assignments]
	);

	/**
	 * Allows students to either create a new group or join an existing one.
	 */
	const createOrJoinGroup = useCallback(
		(courseId, action, targetGroupId) => {
			if (user.role !== "Student") return false;

			setGroups((prev) => {
				const studentId = user.id;
				let newGroups = [...prev];

				if (action === "join" && targetGroupId) {
					const index = newGroups.findIndex(
						(g) => g.id === targetGroupId
					);
					if (
						index !== -1 &&
						!newGroups[index].memberIds.includes(studentId)
					) {
						newGroups[index] = {
							...newGroups[index],
							memberIds: [
								...newGroups[index].memberIds,
								studentId,
							],
						};
						return newGroups;
					}
				}

				if (action === "create") {
					const newGroup = {
						id: generateId(),
						courseId,
						leaderId: studentId,
						memberIds: [studentId],
					};
					return [...newGroups, newGroup];
				}

				return prev;
			});
			return true;
		},
		[user]
	);

	const value = {
		// Data
		getUserCourses,
		getAssignmentsByCourse,
		getProfessorNameById,
		mockCourses,
		mockGroups,
		mockUsers,

		// States
		assignments,
		acknowledgments,
		groups,

		// Logic
		getStudentGroupStatusByCourse,
		acknowledgeSubmission,
		createOrUpdateAssignment,
		createOrJoinGroup,
	};

	return (
		<DataContext.Provider value={value}>{children}</DataContext.Provider>
	);
};
