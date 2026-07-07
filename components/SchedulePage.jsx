"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, getDay } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, EmptyState, PgHeader } from "./ui";
import { DAYS, today } from "@/lib/data";

export default function SchedulePage({ courses }) {
  const [view, setView] = useState("week"); // "week" | "today" | "calendar"
  const todayName = format(today, "EEEE");
  const [calMonth, setCalMonth] = useState(today);

  const weekSched = DAYS.map((day) => ({
    day,
    classes: courses.flatMap((c) => c.schedule.filter((s) => s.day === day).map((s) => ({ ...s, course: c }))).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const calDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDow = getDay(monthStart);

  return (
    <div>
      <PgHeader title="Schedule" subtitle="Manage your weekly class schedule" />
      <div className="flex gap-2 mb-6">
        {["week", "today", "calendar"].map((v) => (
          <button key={v} onClick={() => setView(v)} className={clsx("px-4 py-2 rounded-xl text-sm font-semibold transition-colors", view === v ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700")}>
            {v === "week" ? "Weekly" : v === "today" ? "Today" : "Calendar"}
          </button>
        ))}
      </div>

      {view === "today" && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"><Calendar size={19} className="text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{format(today, "EEEE")}</h3>
              <p className="text-sm text-slate-400">{format(today, "MMMM d, yyyy")}</p>
            </div>
          </div>
          {(() => {
            const classes = weekSched.find((d) => d.day === todayName)?.classes || [];
            return classes.length === 0 ? (
              <EmptyState icon={<Calendar size={26} />} title="No classes today" desc="No classes scheduled for today." />
            ) : (
              <div className="space-y-4">
                {classes.map((cls, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border-l-4 bg-slate-50 dark:bg-slate-700/40" style={{ borderLeftColor: cls.course.color }}>
                    <div className="text-center min-w-14">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{cls.startTime}</div>
                      <div className="text-xs text-slate-400">–</div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{cls.endTime}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{cls.course.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{cls.course.code} · {cls.course.instructor}</div>
                      <div className="text-sm text-slate-400 mt-1">📍 {cls.course.room}</div>
                    </div>
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: cls.course.color }} />
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
      )}

      {view === "week" && (
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-5 gap-3">
              {weekSched.map(({ day, classes }) => {
                const isCurrent = day === todayName;
                return (
                  <div key={day}>
                    <div className={clsx("text-center py-2 px-2 rounded-xl mb-3 text-sm font-bold", isCurrent ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 dark:text-slate-400")}>{day.slice(0, 3)}</div>
                    <div className="space-y-2">
                      {classes.length === 0 ? (
                        <div className="h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center"><span className="text-xs text-slate-300 dark:text-slate-600">No Class</span></div>
                      ) : (
                        classes.map((cls, i) => (
                          <div key={i} className="p-3 rounded-xl text-white text-xs shadow-sm" style={{ backgroundColor: cls.course.color }}>
                            <div className="font-bold mb-1 truncate">{cls.course.code}</div>
                            <div className="opacity-90 truncate text-xs leading-snug">{cls.course.name}</div>
                            <div className="opacity-75 mt-1.5 text-xs">{cls.startTime}–{cls.endTime}</div>
                            <div className="opacity-75 truncate text-xs">📍 {cls.course.room}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCalMonth((m) => addDays(startOfMonth(m), -1))} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><ChevronLeft size={18} className="text-slate-600 dark:text-slate-400" /></button>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{format(calMonth, "MMMM yyyy")}</h3>
            <button onClick={() => setCalMonth((m) => addDays(endOfMonth(m), 1))} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><ChevronRight size={18} className="text-slate-600 dark:text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
            {calDays.map((day) => {
              const dn = format(day, "EEEE");
              const classesOnDay = courses.filter((c) => c.schedule.some((s) => s.day === dn));
              const isTodayDay = isSameDay(day, today);
              return (
                <div key={day.toISOString()} className={clsx("aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs transition-colors", isTodayDay ? "bg-blue-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300")}>
                  <span className="font-semibold">{format(day, "d")}</span>
                  {classesOnDay.length > 0 && !isTodayDay && (
                    <div className="flex gap-0.5">
                      {classesOnDay.slice(0, 3).map((c, i) => <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: c.color }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {courses.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-3">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {c.code}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
