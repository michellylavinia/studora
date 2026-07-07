"use client";

import { clsx } from "clsx";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  BookOpen, Calendar, ClipboardList, UserCheck, Award,
  CheckCircle, Plus, ChevronRight,
} from "lucide-react";
import { Card, Badge, StatCard, EmptyState } from "./ui";
import { today } from "@/lib/data";
import { calcGPA, calcOverallAttendance, calcCourseGrade, calcAttendancePct, toLetterGrade, deadlineText, priorityBadge } from "@/lib/utils";

export default function DashboardPage({ courses, assignments, grades, attendance, profile, setPage }) {
  const gpa = calcGPA(courses, grades);
  const attPct = calcOverallAttendance(attendance);
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const pending = assignments.filter((a) => a.status !== "completed");
  const dueSoon = pending.filter((a) => differenceInDays(parseISO(a.dueDate), today) <= 7).length;
  const todayName = format(today, "EEEE");
  const todayClasses = courses
    .flatMap((c) => c.schedule.filter((s) => s.day === todayName).map((s) => ({ ...s, course: c })))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcoming = pending.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  const progressData = courses.map((c) => {
    const ca = assignments.filter((a) => a.courseId === c.id);
    return { name: c.code, completed: ca.filter((a) => a.status === "completed").length, pending: ca.filter((a) => a.status !== "completed").length };
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const activity = [];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
        <p className="text-blue-200 text-sm mb-1">{format(today, "EEEE, MMMM d, yyyy")}</p>
        <h2 className="text-2xl font-bold mb-1">Welcome{profile.name ? `, ${profile.name.split(" ")[0]}` : ""}! 👋</h2>
        <p className="text-blue-100 text-sm">
          {todayClasses.length > 0 ? `You have ${todayClasses.length} class${todayClasses.length > 1 ? "es" : ""} today` : "No classes scheduled today"}
          {pending.length > 0 ? ` · ${pending.length} pending assignment${pending.length > 1 ? "s" : ""}` : ""}.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Award size={20} />} label="Current GPA" value={gpa.toFixed(2)} subtitle="Out of 4.0" color="blue" />
        <StatCard icon={<BookOpen size={20} />} label="Credits" value={totalCredits} subtitle={`${courses.length} courses`} color="purple" />
        <StatCard icon={<UserCheck size={20} />} label="Attendance" value={`${attPct}%`} subtitle="This semester" color="green" />
        <StatCard icon={<ClipboardList size={20} />} label="Due Soon" value={dueSoon} subtitle="Within 7 days" color="amber" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's classes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Today's Classes</h3>
              <button onClick={() => setPage("schedule")} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">View all<ChevronRight size={13} /></button>
            </div>
            {todayClasses.length === 0 ? (
              <EmptyState icon={<Calendar size={26} />} title="No classes today" desc="Enjoy your free day or catch up on assignments." />
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls, i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors">
                    <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: cls.course.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{cls.course.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{cls.course.code} · {cls.course.room}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cls.startTime}</p>
                      <p className="text-xs text-slate-400">{cls.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Assignment progress chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Assignment Progress</h3>
              <button onClick={() => setPage("assignments")} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">Manage<ChevronRight size={13} /></button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", color: "#f1f5f9", fontSize: 12 }} />
                <Bar dataKey="completed" name="Completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Upcoming assignments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Upcoming Assignments</h3>
              <button onClick={() => setPage("assignments")} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">View all<ChevronRight size={13} /></button>
            </div>
            {upcoming.length === 0 ? (
              <EmptyState icon={<CheckCircle size={26} />} title="All caught up!" desc="No pending assignments. Great work!" />
            ) : (
              <div className="space-y-2">
                {upcoming.map((a) => {
                  const course = courses.find((c) => c.id === a.courseId);
                  const diff = differenceInDays(parseISO(a.dueDate), today);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: (course?.color || "#2563EB") + "20" }}>
                        <ClipboardList size={14} style={{ color: course?.color || "#2563EB" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{a.title}</p>
                        <p className="text-xs text-slate-400">{course?.code}</p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <Badge className={diff < 0 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : diff <= 2 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}>{deadlineText(a.dueDate)}</Badge>
                        <Badge className={priorityBadge(a.priority)}>{a.priority}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* GPA summary */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">GPA Summary</h3>
            <div className="text-center mb-5">
              <div className="text-5xl font-bold text-blue-600">{gpa.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">Semester GPA</div>
            </div>
            <div className="space-y-2.5">
              {courses.map((c) => {
                const pct = calcCourseGrade(grades, c.id);
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate">{c.code}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 w-7 text-center">{toLetterGrade(pct)}</span>
                    <span className="text-xs text-slate-400 w-10 text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Attendance */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Attendance</h3>
            <div className="text-center mb-4">
              <div className={clsx("text-4xl font-bold", attPct >= 85 ? "text-emerald-600" : attPct >= 75 ? "text-amber-500" : "text-red-500")}>{attPct}%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">Overall</div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-4">
              <div className={clsx("h-2 rounded-full transition-all duration-700", attPct >= 85 ? "bg-emerald-500" : attPct >= 75 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${attPct}%` }} />
            </div>
            <div className="space-y-2">
              {courses.map((c) => {
                const p = calcAttendancePct(attendance, c.id);
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex-1 truncate">{c.code}</span>
                    <span className={clsx("text-xs font-bold", p >= 85 ? "text-emerald-600" : p >= 75 ? "text-amber-500" : "text-red-500")}>{p}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* This week */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">This Week</h3>
              <button onClick={() => setPage("schedule")} className="text-xs text-blue-600 font-semibold hover:text-blue-700">View →</button>
            </div>
            <div className="space-y-2">
              {weekDays.map((day, i) => {
                const classes = courses.filter((c) => c.schedule.some((s) => s.day === fullDays[i]));
                const isCurrent = fullDays[i] === todayName;
                return (
                  <div key={day} className={clsx("flex items-center gap-3 p-2 rounded-xl", isCurrent ? "bg-blue-50 dark:bg-blue-900/20" : "")}>
                    <span className={clsx("text-xs font-bold w-8", isCurrent ? "text-blue-600" : "text-slate-400")}>{day}</span>
                    <div className="flex gap-1 flex-1">
                      {classes.length === 0 ? (
                        <span className="text-xs text-slate-300 dark:text-slate-600">Free</span>
                      ) : (
                        classes.map((c, j) => <div key={j} className="w-5 h-5 rounded" style={{ backgroundColor: c.color }} title={c.code} />)
                      )}
                    </div>
                    {classes.length > 0 && <span className="text-xs text-slate-400">{classes.length}x</span>}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Add Assignment", icon: Plus, pg: "assignments", bg: "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400" },
                { label: "View Schedule", icon: Calendar, pg: "schedule", bg: "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400" },
                { label: "Add Course", icon: BookOpen, pg: "courses", bg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400" },
                { label: "Grade Tracker", icon: Award, pg: "grades", bg: "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => setPage(a.pg)} className={clsx("flex flex-col items-center gap-2 p-3.5 rounded-xl text-xs font-semibold transition-colors", a.bg)}>
                    <Icon size={20} />{a.label}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
            {activity.length === 0 ? (
              <EmptyState
                icon={<CheckCircle size={26} />}
                title="No recent activity"
                desc="Your activity will appear here after you start using the system."
              />
            ) : (
              <div className="space-y-3">
                {activity.map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon size={14} className={clsx("mt-0.5 flex-shrink-0", item.col)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{item.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
