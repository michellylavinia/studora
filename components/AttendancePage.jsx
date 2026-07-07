"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { format, addDays, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, getDay } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { UserCheck, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Badge, StatCard, PgHeader } from "./ui";
import { today } from "@/lib/data";
import { calcOverallAttendance, calcAttendancePct } from "@/lib/utils";

export default function AttendancePage({ attendance, courses }) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [calMonth, setCalMonth] = useState(today);

  const overall = calcOverallAttendance(attendance);
  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const calDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDow = getDay(monthStart);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = addDays(startOfMonth(today), -i * 30);
    const mo = d.getMonth(), yr = d.getFullYear();
    const recs = attendance.filter((a) => {
      const dd = parseISO(a.date);
      return dd.getMonth() === mo && dd.getFullYear() === yr;
    });
    const pres = recs.filter((a) => a.status !== "absent").length;
    return { month: format(d, "MMM"), attendance: recs.length ? Math.round((pres / recs.length) * 100) : 0 };
  }).reverse();

  const getDayStatus = (day) => {
    const ds = format(day, "yyyy-MM-dd");
    const recs = attendance.filter((a) => a.date === ds && (courseFilter === "all" || a.courseId === courseFilter));
    if (!recs.length) return null;
    if (recs.every((r) => r.status === "absent")) return "absent";
    if (recs.every((r) => r.status === "present")) return "present";
    return "mixed";
  };

  return (
    <div>
      <PgHeader title="Attendance" subtitle={attendance.length === 0 ? "Record and monitor your attendance" : "Track your class attendance"} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<UserCheck size={20} />} label="Overall" value={`${overall}%`} subtitle="All courses" color="blue" />
        <StatCard icon={<CheckCircle size={20} />} label="Present" value={attendance.filter((a) => a.status === "present").length} subtitle="Sessions" color="green" />
        <StatCard icon={<Clock size={20} />} label="Late" value={attendance.filter((a) => a.status === "late").length} subtitle="Sessions" color="amber" />
        <StatCard icon={<AlertCircle size={20} />} label="Absent" value={attendance.filter((a) => a.status === "absent").length} subtitle="Sessions" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">By Course</h3>
          <div className="space-y-4">
            {courses.map((c) => {
              const p = calcAttendancePct(attendance, c.id);
              const recs = attendance.filter((a) => a.courseId === c.id);
              const pres = recs.filter((a) => a.status !== "absent").length;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{c.code}</span></div>
                    <span className={clsx("text-sm font-bold", p >= 85 ? "text-emerald-600" : p >= 75 ? "text-amber-500" : "text-red-500")}>{p}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${p}%`, backgroundColor: c.color }} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{pres}/{recs.length} sessions attended</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", color: "#f1f5f9", fontSize: 12 }} formatter={(v) => [`${v}%`, "Attendance"]} />
              <Bar dataKey="attendance" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Attendance Calendar</h3>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="all">All Courses</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
            <div className="flex items-center gap-1">
              <button onClick={() => setCalMonth((m) => addDays(startOfMonth(m), -1))} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronLeft size={16} /></button>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-24 text-center">{format(calMonth, "MMM yyyy")}</span>
              <button onClick={() => setCalMonth((m) => addDays(endOfMonth(m), 1))} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
          {calDays.map((day) => {
            const st = getDayStatus(day);
            const isTodayDay = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className={clsx(
                "aspect-square rounded-xl flex items-center justify-center text-xs font-semibold transition-colors",
                isTodayDay && !st ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800 text-blue-600" : "",
                st === "present" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                st === "absent" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                st === "mixed" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}>{format(day, "d")}</div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30" />Present</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30" />Absent</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30" />Mixed</div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Recent History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left py-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wide">Date</th>
                <th className="text-left py-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wide">Course</th>
                <th className="text-left py-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {attendance.filter((a) => courseFilter === "all" || a.courseId === courseFilter).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20).map((a) => {
                const c = courses.find((x) => x.id === a.courseId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-2.5 px-2 text-xs text-slate-700 dark:text-slate-300">{format(parseISO(a.date), "MMM d, yyyy")}</td>
                    <td className="py-2.5 px-2"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c?.color }} /><span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{c?.code}</span></div></td>
                    <td className="py-2.5 px-2">
                      <Badge className={a.status === "present" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : a.status === "late" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
