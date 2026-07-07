import { differenceInDays, parseISO } from "date-fns";
import { today } from "./data";

export function calcCourseGrade(grades, courseId) {
  const cg = grades.filter((g) => g.courseId === courseId);
  if (!cg.length) return 0;
  const tw = cg.reduce((s, g) => s + g.weight, 0);
  if (!tw) return 0;
  return cg.reduce((s, g) => s + (g.score / g.maxScore) * 100 * g.weight, 0) / tw;
}

export function toLetterGrade(pct) {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 60) return "D";
  return "F";
}

export function toGPA(pct) {
  if (pct >= 93) return 4.0;
  if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0;
  if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0;
  if (pct >= 70) return 1.7;
  if (pct >= 67) return 1.3;
  if (pct >= 60) return 1.0;
  return 0.0;
}

export function calcGPA(courses, grades) {
  let pts = 0, creds = 0;
  courses.forEach((c) => {
    const p = calcCourseGrade(grades, c.id);
    if (p > 0) {
      pts += toGPA(p) * c.credits;
      creds += c.credits;
    }
  });
  return creds ? pts / creds : 0;
}

export function calcAttendancePct(attendance, courseId) {
  const r = attendance.filter((a) => a.courseId === courseId);
  if (!r.length) return 0;
  return Math.round((r.filter((a) => a.status !== "absent").length / r.length) * 100);
}

export function calcOverallAttendance(attendance) {
  if (!attendance.length) return 0;
  return Math.round((attendance.filter((a) => a.status !== "absent").length / attendance.length) * 100);
}

export function deadlineText(dueDate) {
  const diff = differenceInDays(parseISO(dueDate), today);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Tomorrow";
  return `${diff} days left`;
}

export function priorityBadge(p) {
  return {
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }[p];
}

export function statusBadge(s) {
  return {
    pending: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  }[s];
}
