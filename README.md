# Joineazy Task 2: Student, Group & Assignment Management System - Frontend

This repository houses the advanced frontend implementation for the Student, Group & Assignment Management System, built using **React.js** and **Tailwind CSS**.

The primary focus of this task was on **UI/UX design**, translating complex **role-based workflows** (especially group management and acknowledgment logic) into highly intuitive, responsive, and aesthetically pleasing user interfaces.

## Live Demo & Repository

You can view the live deployment of this project here:
**[https://joineazy-task2.vercel.app/](https://joineazy-task2.vercel.app/)**

---

## Key Frontend Technologies & Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React.js** | Core component-based UI logic. |
| **Styling** | **Tailwind CSS** + **daisyUI** | Utility-first styling for responsiveness and pre-built components. |
| **Routing** | **react-router-dom** | Declarative navigation, including role-based protected routes. |
| **State** | **Context API** & **Custom Hooks** | Centralized state for Authentication (`AuthContext`) and data (`DataContext`). |
| **Icons** | **lucide-react** | Clean, modular icon set. |
| **Utilities** | **dayjs**, **react-hot-toast** | Date/time manipulation and smooth, non-intrusive user feedback. |

---

## Design and UX Principles

The application design is guided by clarity, efficiency, and role-specific utility:

1.  **Workflow Intuition:** Each role (Professor/Student) is presented with a dashboard that prioritizes the most relevant actions (e.g., Professor sees submission analytics; Student sees submission acknowledgment status).
2.  **Visual Feedback:** Extensive use of **progress bars**, **badges**, and **checkmarks** provides instant comprehension of submission and group status (Progress Visualization).
3.  **Smooth Interactions:** Subtle animations, focused hover states, and modal confirmations (e.g., `CreateAssignmentModal`, `SubmissionModal`) ensure a smooth, enterprise-grade feel.
4.  **Theming:** Includes a global **Theme Toggle** (`ThemeContext`) for user preference (Light/Dark mode).
5.  **Mobile Responsiveness:** A **mobile-first approach** ensures the UI is fully functional and visually appealing across all devices, from desktop monitors to small smartphones.

---

## Core Frontend UX Flows

### 1. Professor Flow: Management & Analytics

* **Dashboard:** Displays all courses the Professor **teaches** (`CourseCard` component).
* **Assignment Management Page:**
    * **CRUD:** Full creation, editing, and viewing of assignments (including Deadline, OneDrive Link, and **Submission Type**).
    * **Analytics:** Clear display of submission progress, showing the number of students/groups submitted vs. total (e.g., "15/30 Students Submitted").

### 2. Student Flow: Submission & Group Logic

* **Dashboard:** Displays all courses the student is **enrolled in**.
* **Assignment Page (Critical Logic):**
    * **Status Display:** Clearly shows Assignment Details and **Acknowledgment Status**.
    * **Individual Submission:** Student can acknowledge submission directly. This is stored with a **timestamp**.
    * **Group Submission:** Only the designated **Group Leader** sees the Acknowledge button. Acknowledgment by the leader instantly updates the status for **all group members**.
    * **Group Status Alert:** If a student is not in a group, a prominent alert (`GroupStatusAlert`) directs them to the `GroupManagementModal`.

---

## Project Architecture

The application is structured to support scalability and maintain clear separation between roles and concerns.

### Folder Structure

```
joineazy-task1/
├── App.jsx
├── index.css
├── main.jsx
├── public/
└── src/
    ├── assets/
    ├── components/
    │   ├── common/                // Reusable components shared across all parts (e.g., Navbar, Cards).
    │   ├── professor/             // Components exclusive to the Professor UI (e.g., Modals for assignment creation).
    │   └── student/               // Components exclusive to the Student UI (e.g., Group management modals).
    ├── contexts/                  // Central state management providers (Auth, Data, Theme).
    ├── data/                      // Stores simulated data for the application (e.g., mockData.js).
    ├── hooks/                     // Custom React hooks for logic reuse (e.g., useAuth, useTheme).
    └── pages/
        ├── auth/                  // Pages related to authentication and user login (e.g., LoginPage).
        ├── professor/             // Pages screen views specific to the Professor role.
        └── student/               // Pages screen views specific to the Student role.
```

---

## Setup and Installation

### Prerequisites
* Node.js (LTS version recommended)
* A running **backend/API** or the provided `mockData.js` file enabled for local testing.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ChiranjeeviNanda/joineazy-task2](https://github.com/ChiranjeeviNanda/joineazy-task2)
    cd joineazy-task2/frontend 
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will typically be accessible at `http://localhost:5173`.

---

## Screenshots

*(To be filled upon deployment)*
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/15d3717c-f4cf-4905-9256-e39333aefc83" width="300" alt="Admin Dashboard - Desktop Light Theme" />
        <br />
        <sub><b>Professor Dashboard (Desktop - Light Theme)</b></sub>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/7b475467-7698-4deb-a9a3-e08854c4637d" width="300" alt="Admin Dashboard - Desktop Light Theme" />
        <br />
        <sub><b>Professor Assignment Management (Desktop - Light Theme)</b></sub>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/414902c9-0285-42d1-abff-b4913773674f" width="300" alt="Student Dashboard - Desktop Light Theme" />
        <br />
        <sub><b>Student Dashboard (Desktop - Light Theme)</b></sub>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/8c853ea8-5286-4cd7-b96f-7d3093c5c7ed" width="300" alt="Admin Progress View - Desktop Dark Theme" />
        <br />
        <sub><b>Student Assignments (Desktop - Light Theme)</b></sub>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/7a1f9590-6393-4f99-b73f-617b5e1a5b95" width="200" alt="Student Dashboard - Mobile Light Theme" />
        <br />
        <sub><b>Professor Dashboard (Mobile - Light Theme)</b></sub>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/72a4de68-d402-4baa-8ac3-365902446370" width="200" alt="Admin Dashboard - Mobile Dark Theme" />
        <br />
        <sub><b>Student Dashboard (Mobile - Dark Theme)</b></sub>
      </td>
    </tr>
  </table>
</div>

---

## Author

**[@ChiranjeeviNanda](https://github.com/ChiranjeeviNanda)**
