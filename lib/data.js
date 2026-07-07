import { format, addDays } from "date-fns";

// ─── Constants ────────────────────────────────────────────────────────────────

export const COURSE_COLORS = [
  "#2563EB", "#7C3AED", "#DC2626", "#059669",
  "#D97706", "#0891B2", "#BE185D", "#4F46E5",
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// "today" is fixed once when the app loads, so all the sample data
// (due dates, attendance history, etc.) stays consistent during a session.
export const today = new Date();

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const initCourses = [
  { id: "c1", name: "Data Structures & Algorithms", code: "CS 301", credits: 3, semester: "Spring 2024", instructor: "Dr. Sarah Mitchell", room: "Tech Hall 201", schedule: [{ day: "Monday", startTime: "09:00", endTime: "10:30" }, { day: "Wednesday", startTime: "09:00", endTime: "10:30" }], color: "#2563EB" },
  { id: "c2", name: "Calculus II", code: "MATH 201", credits: 4, semester: "Spring 2024", instructor: "Prof. James Chen", room: "Math Building 105", schedule: [{ day: "Tuesday", startTime: "11:00", endTime: "12:30" }, { day: "Thursday", startTime: "11:00", endTime: "12:30" }], color: "#7C3AED" },
  { id: "c3", name: "Technical Writing", code: "ENG 150", credits: 3, semester: "Spring 2024", instructor: "Dr. Emily Roberts", room: "Humanities 302", schedule: [{ day: "Wednesday", startTime: "14:00", endTime: "15:30" }, { day: "Friday", startTime: "14:00", endTime: "15:30" }], color: "#059669" },
  { id: "c4", name: "Physics I: Mechanics", code: "PHYS 201", credits: 4, semester: "Spring 2024", instructor: "Prof. David Park", room: "Science Center 410", schedule: [{ day: "Monday", startTime: "13:00", endTime: "14:30" }, { day: "Friday", startTime: "09:00", endTime: "10:30" }], color: "#DC2626" },
  { id: "c5", name: "Intro to Machine Learning", code: "CS 401", credits: 3, semester: "Spring 2024", instructor: "Dr. Lisa Wang", room: "Tech Hall 305", schedule: [{ day: "Tuesday", startTime: "14:00", endTime: "15:30" }, { day: "Thursday", startTime: "14:00", endTime: "15:30" }], color: "#D97706" },
];

export const initAssignments = [
  { id: "a1", courseId: "c1", title: "Binary Search Tree Implementation", description: "Implement BST with insert, delete, and search in C++", dueDate: format(addDays(today, 3), "yyyy-MM-dd"), priority: "high", status: "in-progress" },
  { id: "a2", courseId: "c2", title: "Integration Techniques Problem Set", description: "Complete problems 1–20 from Chapter 7", dueDate: format(addDays(today, 5), "yyyy-MM-dd"), priority: "medium", status: "pending" },
  { id: "a3", courseId: "c3", title: "Technical Report Draft", description: "2000-word technical report on a software topic", dueDate: format(addDays(today, 7), "yyyy-MM-dd"), priority: "medium", status: "pending" },
  { id: "a4", courseId: "c4", title: "Lab Report: Projectile Motion", description: "Formal lab report analyzing projectile motion data", dueDate: format(addDays(today, 1), "yyyy-MM-dd"), priority: "high", status: "in-progress" },
  { id: "a5", courseId: "c5", title: "Linear Regression from Scratch", description: "Implement linear regression using only NumPy", dueDate: format(addDays(today, 10), "yyyy-MM-dd"), priority: "low", status: "pending" },
  { id: "a6", courseId: "c1", title: "Graph Traversal Algorithms", description: "Implement BFS and DFS with test cases", dueDate: format(addDays(today, -5), "yyyy-MM-dd"), priority: "high", status: "completed" },
  { id: "a7", courseId: "c2", title: "Chapter 6 Homework", description: "Trigonometric substitution problems", dueDate: format(addDays(today, -10), "yyyy-MM-dd"), priority: "low", status: "completed" },
  { id: "a8", courseId: "c5", title: "NumPy Basics Assignment", description: "Basic NumPy operations and array manipulations", dueDate: format(addDays(today, -3), "yyyy-MM-dd"), priority: "medium", status: "completed" },
];

export const initGrades = [
  { id: "g1", courseId: "c1", type: "assignment", title: "Linked Lists", score: 92, maxScore: 100, weight: 10, date: format(addDays(today, -30), "yyyy-MM-dd") },
  { id: "g2", courseId: "c1", type: "quiz", title: "Quiz 1: Arrays", score: 18, maxScore: 20, weight: 5, date: format(addDays(today, -25), "yyyy-MM-dd") },
  { id: "g3", courseId: "c1", type: "midterm", title: "Midterm Exam", score: 85, maxScore: 100, weight: 30, date: format(addDays(today, -15), "yyyy-MM-dd") },
  { id: "g4", courseId: "c1", type: "assignment", title: "Sorting Algorithms", score: 95, maxScore: 100, weight: 10, date: format(addDays(today, -10), "yyyy-MM-dd") },
  { id: "g5", courseId: "c2", type: "assignment", title: "Chapter 5 HW", score: 78, maxScore: 100, weight: 10, date: format(addDays(today, -28), "yyyy-MM-dd") },
  { id: "g6", courseId: "c2", type: "quiz", title: "Integration Quiz", score: 16, maxScore: 20, weight: 5, date: format(addDays(today, -20), "yyyy-MM-dd") },
  { id: "g7", courseId: "c2", type: "midterm", title: "Midterm Exam", score: 72, maxScore: 100, weight: 35, date: format(addDays(today, -12), "yyyy-MM-dd") },
  { id: "g8", courseId: "c3", type: "assignment", title: "Essay 1", score: 88, maxScore: 100, weight: 20, date: format(addDays(today, -22), "yyyy-MM-dd") },
  { id: "g9", courseId: "c3", type: "assignment", title: "Memo Writing", score: 91, maxScore: 100, weight: 15, date: format(addDays(today, -14), "yyyy-MM-dd") },
  { id: "g10", courseId: "c4", type: "quiz", title: "Quiz 1: Kinematics", score: 17, maxScore: 20, weight: 5, date: format(addDays(today, -26), "yyyy-MM-dd") },
  { id: "g11", courseId: "c4", type: "assignment", title: "Lab Report 1", score: 84, maxScore: 100, weight: 10, date: format(addDays(today, -18), "yyyy-MM-dd") },
  { id: "g12", courseId: "c4", type: "midterm", title: "Midterm Exam", score: 79, maxScore: 100, weight: 30, date: format(addDays(today, -8), "yyyy-MM-dd") },
  { id: "g13", courseId: "c5", type: "assignment", title: "Python Basics", score: 97, maxScore: 100, weight: 10, date: format(addDays(today, -24), "yyyy-MM-dd") },
  { id: "g14", courseId: "c5", type: "quiz", title: "Statistics Quiz", score: 19, maxScore: 20, weight: 5, date: format(addDays(today, -16), "yyyy-MM-dd") },
];

// Generates 30 days of random-ish attendance history for every course,
// on the days that course actually meets.
export function generateAttendance() {
  const records = [];
  let idx = 1;
  initCourses.forEach((course) => {
    for (let i = 30; i >= 0; i--) {
      const date = addDays(today, -i);
      const dayName = format(date, "EEEE");
      course.schedule.forEach((slot) => {
        if (slot.day === dayName) {
          const r = Math.random();
          const status = r < 0.82 ? "present" : r < 0.92 ? "late" : "absent";
          records.push({ id: `att${idx++}`, courseId: course.id, date: format(date, "yyyy-MM-dd"), status });
        }
      });
    }
  });
  return records;
}

export const initProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  studentId: "CS2021045",
  major: "Computer Science",
  year: "Junior (3rd Year)",
  phone: "+1 (555) 234-5678",
  bio: "Passionate about algorithms, ML, and building scalable systems. Looking to intern at a tech company this summer.",
  avatar: "",
};

export const initSettings = {
  darkMode: false,
  emailNotifications: true,
  pushNotifications: true,
  assignmentReminders: true,
  gradeAlerts: false,
  language: "English",
};
