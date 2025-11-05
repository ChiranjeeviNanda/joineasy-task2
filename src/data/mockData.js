/**
 * Mock dataset for the academic management system.
 * Includes users, courses, assignments, groups, and acknowledgments
 * used for frontend testing and development.
 */

/**
 * Generates a simple, non-secure unique ID string for mock objects.
 * Returns a short alphanumeric identifier.
 */
const generateId = () => Math.random().toString(36).substring(2, 9);

// Timestamps for demonstrating ordering
const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200000).toISOString();

/**
 * Mock user accounts, representing both professors and students.
 * Each user has an ID, role, and list of associated course IDs.
 */
const mockUsers = [
	// Professors
	{
		id: "p101",
		username: "p101",
		password: "password",
		role: "Professor",
		name: "Prof. Priya Sharma",
		courseIds: ["c101", "c102"],
	},
	{
		id: "p102",
		username: "p102",
		password: "password",
		role: "Professor",
		name: "Prof. Anand Varma",
		courseIds: ["c103"],
	},

	// Students
	{
		id: "s201",
		username: "s201",
		password: "password",
		role: "Student",
		name: "Aarav Joshi",
		courseIds: ["c101", "c103"],
	},
	{
		id: "s202",
		username: "s202",
		password: "password",
		role: "Student",
		name: "Bhavik Patel",
		courseIds: ["c102"],
	},
	{
		id: "s203",
		username: "s203",
		password: "password",
		role: "Student",
		name: "Chaitra Rao",
		courseIds: ["c102", "c103"],
	},
	{
		id: "s204",
		username: "s204",
		password: "password",
		role: "Student",
		name: "Divya Menon",
		courseIds: ["c101", "c103"],
	},
];

/**
 * Mock course data linking professors and enrolled students.
 * Each course is associated with one professor and multiple students.
 */
const mockCourses = [
	{
		id: "c101",
		name: "Advanced React Development",
		professorId: "p101",
		studentIds: ["s201", "s202", "s204"],
	},
	{
		id: "c102",
		name: "Data Structures & Algorithms",
		professorId: "p101",
		studentIds: ["s203"],
	},
	{
		id: "c103",
		name: "UI/UX Design Principles",
		professorId: "p102",
		studentIds: ["s201", "s203", "s204"],
	},
];

/**
 * Mock assignments created under specific courses.
 * Includes details such as title, description, deadline, and submission type.
 */
const mockAssignments = [
	{
		id: "a301",
		courseId: "c101",
		title: "Component Architecture Design",
		description: "Design a scalable component library.",
		deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
		submissionType: "Group",
		oneDriveLink: "https://onedrive.link/a301",
		createdAt: twoHoursAgo,
	},
	{
		id: "a302",
		courseId: "c101",
		title: "Individual Project Setup",
		description: "Set up your personal development environment.",
		deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
		submissionType: "Individual",
		oneDriveLink: "https://onedrive.link/a302",
		createdAt: oneHourAgo,
	},
];

/**
 * Mock groups representing student teams for group-based assignments.
 * Each group includes a leader and all member IDs.
 */
const mockGroups = [
	{
		id: "g401",
		courseId: "c101",
		leaderId: "s201",
		memberIds: ["s201", "s202"],
	},
];

/**
 * Mock acknowledgments tracking assignment submissions.
 * Records whether a student or group has acknowledged or submitted an assignment.
 */
const mockAcknowledgments = [
	{
		assignmentId: "a302",
		submitterId: "s203",
		acknowledged: true,
		timestamp: new Date().toISOString(),
	},
	{
		assignmentId: "a301",
		submitterId: "g401",
		acknowledged: true,
		timestamp: new Date().toISOString(),
	},
];

export {
	mockUsers,
	mockCourses,
	mockAssignments,
	mockGroups,
	mockAcknowledgments,
	generateId,
};
