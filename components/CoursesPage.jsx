"use client";

import { useState } from "react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Plus, Search, Edit2, Trash2, BookOpen, User, MapPin, BookMarked, X } from "lucide-react";
import { Card, Btn, Inp, Sel, Badge, Modal, ConfirmModal, EmptyState, PgHeader } from "./ui";
import { COURSE_COLORS, DAYS } from "@/lib/data";
import { uid } from "@/lib/storage";
import { calcCourseGrade, calcAttendancePct, toLetterGrade } from "@/lib/utils";

export default function CoursesPage({ courses, setCourses, assignments, setAssignments, grades, setGrades, attendance, setAttendance }) {
  const [search, setSearch] = useState("");
  const [semFilter, setSemFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const sems = ["all", ...Array.from(new Set(courses.map((c) => c.semester)))];
  const filtered = courses.filter((c) => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    return ms && (semFilter === "all" || c.semester === semFilter);
  });

  const blank = { name: "", code: "", credits: 3, semester: "", instructor: "", room: "", schedule: [{ day: "Monday", startTime: "09:00", endTime: "10:30" }], color: COURSE_COLORS[0] };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setEditCourse(null); setModalOpen(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditCourse(c); setModalOpen(true); };

  const save = () => {
    if (
        !form.name.trim() ||
        !form.code.trim() ||
        !form.semester.trim()
    ){
        toast.error("Please fill in all required fields.");
        return;
    }

    if (form.credits < 1 || form.credits > 6) {
      toast.error("Credits must be between 1 and 6.");
      return;
    }

    const exists = courses.some(
      (c) =>
        c.code.toLowerCase() === form.code.toLowerCase() &&
        c.id !== editCourse?.id
      );

    if (exists) {
      toast.error("Course code already exists.");
      return;
    }

    if (editCourse) {
      setCourses((cs) => cs.map((c) => (c.id === editCourse.id ? { ...form, id: editCourse.id } : c)));
      toast.success("Course updated!");
    } else {
      setCourses((cs) => [...cs, { ...form, id: uid() }]);
      toast.success("Course added!");
    }
    setModalOpen(false);
  };

  const del = () => {
    if (!deleteId) return;
    setCourses((cs) => cs.filter((c) => c.id !== deleteId));
    setAssignments((as) => as.filter((a) => a.courseId !== deleteId));
    setGrades((gs) => gs.filter((g) => g.courseId !== deleteId));
    setAttendance((at) => at.filter((a) => a.courseId !== deleteId));
    toast.success("Course deleted");
    setDeleteId(null);
  };

  const updateSlot = (i, key, val) => setForm((f) => {
    const schedule = [...f.schedule];
    schedule[i] = { ...schedule[i], [key]: val };
    return { ...f, schedule };
  });

  return (
    <div>
      <PgHeader title="Courses Management" subtitle={courses.length === 0 ? "Manage your enrolled courses" : `${courses.length} enrolled course${courses.length > 1 ? "s" : ""}`} action={<Btn onClick={openAdd}><Plus size={15} />Add Course</Btn>} />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search courses, instructors..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={semFilter} onChange={(e) => setSemFilter(e.target.value)}>
          {sems.map((s) => <option key={s} value={s}>{s === "all" ? "All Semesters" : s}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen size={28} />} title="No courses found" desc={search ? "Try a different search term" : "Add your first course to get started"} action={<Btn onClick={openAdd}><Plus size={15} />Add Course</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((course) => {
            const pct = calcCourseGrade(grades, course.id);
            const ap = calcAttendancePct(attendance, course.id);
            const ca = assignments.filter((a) => a.courseId === course.id);
            const done = ca.filter((a) => a.status === "completed").length;
            return (
              <Card key={course.id} className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: course.color + "20" }}>
                      <BookOpen size={17} style={{ color: course.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{course.code}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">{course.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                    <button onClick={() => openEdit(course)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => setDeleteId(course.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><User size={12} /><span className="truncate">{course.instructor}</span></div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><MapPin size={12} /><span>{course.room}</span></div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><BookMarked size={12} /><span>{course.credits} credits · {course.semester}</span></div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.schedule.map((s, i) => <Badge key={i} className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{s.day.slice(0, 3)} {s.startTime}</Badge>)}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="text-center"><div className="text-sm font-bold text-slate-900 dark:text-slate-100">{toLetterGrade(pct)}</div><div className="text-xs text-slate-400">Grade</div></div>
                  <div className="text-center"><div className={clsx("text-sm font-bold", ap >= 85 ? "text-emerald-600" : ap >= 75 ? "text-amber-500" : "text-red-500")}>{ap}%</div><div className="text-xs text-slate-400">Attend.</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-slate-900 dark:text-slate-100">{done}/{ca.length}</div><div className="text-xs text-slate-400">Done</div></div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editCourse ? "Edit Course" : "Add Course"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Course Name" placeholder="Data Structures" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Inp label="Course Code" placeholder="STSI4104" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase(), }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Credits" type="number" min={1} max={6} value={form.credits} onChange={(e) => setForm((f) => ({ ...f, credits: +e.target.value }))} />
            <Inp label="Semester" placeholder="2" value={form.semester} onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))} />
          </div>
          <Inp label="Instructor" placeholder="Dr. Sarah" value={form.instructor} onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))} />
          <Inp label="Room" placeholder="Room 05" value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} />
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">Course Color</label>
            <div className="flex gap-2 flex-wrap">
              {COURSE_COLORS.map((color) => (
                <button key={color} type="button" className={clsx("w-7 h-7 rounded-lg transition-all hover:scale-110", form.color === color ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "")} style={{ backgroundColor: color }} onClick={() => setForm((f) => ({ ...f, color }))} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">Schedule</label>
            {form.schedule.map((slot, i) => (
              <div key={i} className="flex gap-2 mb-2 items-end flex-wrap">
                <div className="flex-1 min-w-28">
                  <Sel options={DAYS.map((d) => ({ value: d, label: d }))} value={slot.day} onChange={(e) => updateSlot(i, "day", e.target.value)} />
                </div>
                <Inp type="time" value={slot.startTime} onChange={(e) => updateSlot(i, "startTime", e.target.value)} className="w-28 flex-shrink-0" />
                <Inp type="time" value={slot.endTime} onChange={(e) => updateSlot(i, "endTime", e.target.value)} className="w-28 flex-shrink-0" />
                {form.schedule.length > 1 && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, schedule: f.schedule.filter((_, j) => j !== i) }))} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-shrink-0"><X size={15} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setForm((f) => ({ ...f, schedule: [...f.schedule, { day: "Monday", startTime: "09:00", endTime: "10:30" }] }))} className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 mt-1"><Plus size={13} />Add time slot</button>
          </div>
          <div className="flex gap-3 pt-2">
            <Btn variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={save} className="flex-1">{editCourse ? "Save Changes" : "Add Course"}</Btn>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={del} title="Delete Course" message="Are you sure? This will permanently delete the course and all associated assignments, grades, and attendance records." />
    </div>
  );
}
