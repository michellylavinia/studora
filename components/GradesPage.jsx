"use client";

import { useState } from "react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Plus, Edit2, Trash2, Award } from "lucide-react";
import { Card, Btn, Inp, Sel, Badge, Modal, ConfirmModal, EmptyState, PgHeader } from "./ui";
import { today } from "@/lib/data";
import { uid } from "@/lib/storage";
import { calcGPA, calcCourseGrade, toLetterGrade } from "@/lib/utils";

const typeLabels = { assignment: "Assignment", quiz: "Quiz", exam: "Exam", project: "Project", midterm: "Midterm", final: "Final" };
const typeBadge = {
  assignment: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  quiz: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  exam: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  project: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  midterm: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  final: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function GradesPage({ grades, setGrades, courses }) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editGrade, setEditGrade] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const gpa = calcGPA(courses, grades);
  const chartData = courses.map((c) => {
    const p = calcCourseGrade(grades, c.id);
    return { name: c.code, grade: Math.round(p), color: c.color };
  });

  const blank = { courseId: courses[0]?.id || "", type: "assignment", title: "", score: 0, maxScore: 100, weight: 10, date: format(today, "yyyy-MM-dd") };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setEditGrade(null); setModalOpen(true); };
  const openEdit = (g) => { setForm({ ...g }); setEditGrade(g); setModalOpen(true); };

  const saveGrade = () => {
    if (!form.title.trim() || !form.courseId) { toast.error("Please fill in all required fields."); return; }
    if (form.score < 0) {
        toast.error("Score cannot be negative.");
        return;
    }
    if (form.score > form.maxScore) {
        toast.error("Score cannot exceed the maximum score.");
        return;
    }
    if (form.maxScore <= 0) {
        toast.error("Maximum score must be greater than zero.");
        return;
    }
    if (form.weight < 1 || form.weight > 100) {
        toast.error("Weight must be between 1 and 100.");
        return;
    }
    if (editGrade) {
      setGrades((gs) => gs.map((g) => (g.id === editGrade.id ? { ...form, id: editGrade.id } : g)));
      toast.success("Grade updated");
    } else {
      setGrades((gs) => [...gs, { ...form, id: uid() }]);
      toast.success("Grade added");
    }
    setModalOpen(false);
  };

  const filtered = grades.filter((g) => courseFilter === "all" || g.courseId === courseFilter);

  return (
    <div>
      <PgHeader title="Grade Tracker" subtitle={grades.length === 0 ? "Track grades and calculate your GPA" : "Monitor your academic performance"} action={<Btn onClick={openAdd} disabled={courses.length === 0}><Plus size={15} />Add Grade</Btn>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="space-y-4">
          <Card className="p-6 text-center">
            {grades.length === 0 ? (
              <EmptyState
                icon={<Award size={24} />}
                title="No GPA available"
                desc="Add grades to calculate your GPA."
              />
            ) : (
              <>
                <div className="text-5xl font-bold text-blue-600 mb-1">{gpa.toFixed(2)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Cumulative GPA</div>
                <div className={clsx("mt-3 inline-block px-3 py-1 rounded-full text-sm font-bold", gpa >= 3.7 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : gpa >= 3.0 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : gpa >= 2.0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                  {gpa >= 3.7 ? "Dean's List 🎓" : gpa >= 3.0 ? "Good Standing" : gpa >= 2.0 ? "Satisfactory" : "At Risk"}
                </div>
              </>
            )}
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Course Grades</h3>
            <div className="space-y-3">
              {courses.map((c) => {
                const pct = calcCourseGrade(grades, c.id);
                const letter = toLetterGrade(pct);
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{c.code}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{pct.toFixed(1)}%</span>
                        <Badge className={clsx("font-bold text-xs", pct >= 90 ? "bg-emerald-100 text-emerald-700" : pct >= 80 ? "bg-blue-100 text-blue-700" : pct >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>{letter}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Grade Overview by Course</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", color: "#f1f5f9", fontSize: 12 }} formatter={(v) => [`${v}%`, "Grade"]} />
                <Bar dataKey="grade" radius={[6, 6, 0, 0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Grade Records</h3>
          <select className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="all">All Courses</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Award size={28} />} title={courses.length === 0 ? "No courses available" : "No grades yet"} desc={courses.length === 0 ? "Create a course before adding grades." : "Add your first grade entry to start tracking."} action={<Btn onClick={openAdd} disabled={courses.length === 0}><Plus size={15} />Add Grade</Btn>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {["Course", "Type", "Title", "Score", "Weight", "Grade", ""].map((h) => (
                    <th key={h} className={clsx("py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wide", h === "Score" || h === "Weight" || h === "Grade" ? "text-right" : "text-left", h === "Weight" && "hidden sm:table-cell")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((g) => {
                  const course = courses.find((c) => c.id === g.courseId);
                  const pct = (g.score / g.maxScore) * 100;
                  return (
                    <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-2"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: course?.color }} /><span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{course?.code}</span></div></td>
                      <td className="py-3 px-2"><Badge className={typeBadge[g.type]}>{typeLabels[g.type]}</Badge></td>
                      <td className="py-3 px-2 max-w-36"><span className="text-slate-900 dark:text-slate-100 truncate block">{g.title}</span></td>
                      <td className="py-3 px-2 text-right text-slate-700 dark:text-slate-300 font-semibold">{g.score}/{g.maxScore}</td>
                      <td className="py-3 px-2 text-right text-slate-400 hidden sm:table-cell">{g.weight}%</td>
                      <td className="py-3 px-2 text-right"><span className={clsx("font-bold", pct >= 90 ? "text-emerald-600" : pct >= 80 ? "text-blue-600" : pct >= 70 ? "text-amber-600" : "text-red-600")}>{pct.toFixed(0)}%</span></td>
                      <td className="py-3 px-2">
                        <div className="flex gap-0.5 justify-end">
                          <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Edit2 size={12} /></button>
                          <button onClick={() => setDeleteId(g.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editGrade ? "Edit Grade" : "Add Grade"}>
        <div className="space-y-4">
          <Sel label="Course" value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))} options={courses.map((c) => ({ value: c.id, label: `${c.code} – ${c.name}` }))} />
          <Sel label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} options={Object.entries(typeLabels).map(([v, l]) => ({ value: v, label: l }))} />
          <Inp label="Title" placeholder="Midterm Exam" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <div className="grid grid-cols-3 gap-3">
            <Inp label="Score" type="number" min={0} value={form.score} onChange={(e) => setForm((f) => ({ ...f, score: +e.target.value }))} />
            <Inp label="Max Score" type="number" min={1} value={form.maxScore} onChange={(e) => setForm((f) => ({ ...f, maxScore: +e.target.value }))} />
            <Inp label="Weight %" type="number" min={0} max={100} value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: +e.target.value }))} />
          </div>
          <Inp label="Date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          {form.maxScore > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm font-semibold text-blue-700 dark:text-blue-300">{((form.score / form.maxScore) * 100).toFixed(1)}% · {toLetterGrade((form.score / form.maxScore) * 100)}</div>
          )}
          <div className="flex gap-3 pt-2">
            <Btn variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={saveGrade} className="flex-1">{editGrade ? "Save Changes" : "Add Grade"}</Btn>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setGrades((gs) => gs.filter((g) => g.id !== deleteId)); toast.success("Grade deleted"); setDeleteId(null); }} title="Delete Grade" message="Are you sure you want to delete this grade record?" />
    </div>
  );
}
