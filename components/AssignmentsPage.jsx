"use client";

import { useState } from "react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { Plus, Edit2, Trash2, Check, ClipboardList } from "lucide-react";
import { Card, Btn, Inp, Sel, Txa, Badge, Modal, ConfirmModal, EmptyState, PgHeader } from "./ui";
import { today } from "@/lib/data";
import { uid } from "@/lib/storage";
import { deadlineText, priorityBadge, statusBadge } from "@/lib/utils";

export default function AssignmentsPage({ assignments, setAssignments, courses }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("deadline");
  const [modalOpen, setModalOpen] = useState(false);
  const [editAsgn, setEditAsgn] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const po = { high: 0, medium: 1, low: 2 };
  const filtered = assignments
    .filter((a) => filter === "all" || a.status === filter)
    .sort((a, b) => (sort === "deadline" ? a.dueDate.localeCompare(b.dueDate) : po[a.priority] - po[b.priority]));

  const done = assignments.filter((a) => a.status === "completed").length;
  const pct = assignments.length ? Math.round((done / assignments.length) * 100) : 0;

  const blank = { courseId: courses[0]?.id || "", title: "", description: "", dueDate: format(addDays(today, 7), "yyyy-MM-dd"), priority: "medium", status: "pending" };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setEditAsgn(null); setModalOpen(true); };
  const openEdit = (a) => { setForm({ ...a }); setEditAsgn(a); setModalOpen(true); };

  const saveAsgn = () => {
    if (
      !form.title.trim() ||
      !form.courseId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (parseISO(form.dueDate) < today) {
      toast.error("Due date cannot be in the past.");
      return;
    }
    if (editAsgn) {
      setAssignments((as) => as.map((a) => (a.id === editAsgn.id ? { ...form, id: editAsgn.id } : a)));
      toast.success("Assignment updated");
    } else {
      setAssignments((as) => [...as, { ...form, id: uid() }]);
      toast.success("Assignment added");
    }
    setModalOpen(false);
  };

  const toggle = (a) => {
    const s = a.status === "completed" ? "pending" : "completed";
    setAssignments((as) => as.map((x) => (x.id === a.id ? { ...x, status: s } : x)));
    toast.success(s === "completed" ? "Marked complete! ✓" : "Marked as pending");
  };

  return (
    <div>
      <PgHeader
        title="Assignments"
        subtitle={`${done} of ${assignments.length} completed`}
        action={<Btn onClick={openAdd} disabled={courses.length === 0}><Plus size={15} />Add Assignment</Btn>}
      />

      {/* Progress */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Progress</span>
          <span className="text-sm font-bold text-blue-600">{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>{done} completed</span><span>{assignments.length - done} remaining</span>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "in-progress", "completed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={clsx("px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors", filter === f ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700")}>
              {f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select className="px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ClipboardList size={28} />} title={courses.length === 0 ? "No courses available" : "No assignments yet"} desc={courses.length === 0 ? "Create a course before adding assignments." : "Add your first assignment to track it."} action={<Btn onClick={openAdd} disabled={courses.length === 0}><Plus size={15} />Add Assignment</Btn>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const course = courses.find((c) => c.id === a.courseId);
            const diff = differenceInDays(parseISO(a.dueDate), today);
            const overdue = diff < 0 && a.status !== "completed";
            return (
              <Card key={a.id} className={clsx("p-4 hover:shadow-md transition-all", a.status === "completed" && "opacity-60")}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(a)} className={clsx("mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all", a.status === "completed" ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600 hover:border-blue-500")}>
                    {a.status === "completed" && <Check size={11} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={clsx("font-semibold text-slate-900 dark:text-slate-100 text-sm", a.status === "completed" && "line-through text-slate-400")}>{a.title}</p>
                    {a.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{a.description}</p>}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {course && <Badge style={{ backgroundColor: course.color + "22", color: course.color }}>{course.code}</Badge>}
                      <Badge className={priorityBadge(a.priority)}>{a.priority}</Badge>
                      <Badge className={statusBadge(a.status)}>{a.status === "in-progress" ? "In Progress" : a.status.charAt(0).toUpperCase() + a.status.slice(1)}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className={clsx("text-xs font-bold", overdue ? "text-red-600" : diff <= 2 ? "text-amber-600" : "text-slate-400")}>{deadlineText(a.dueDate)}</div>
                    <div className="text-xs text-slate-400">{format(parseISO(a.dueDate), "MMM d")}</div>
                    <div className="flex gap-0.5">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Edit2 size={12} /></button>
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editAsgn ? "Edit Assignment" : "Add Assignment"}>
        <div className="space-y-4">
          <Sel label="Course" value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))} options={courses.map((c) => ({ value: c.id, label: `${c.code} – ${c.name}` }))} />
          <Inp label="Title" placeholder="Binary Search Tree Implementation" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Txa label="Description (optional)" placeholder="Describe the assignment..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            <Sel label="Priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} />
          </div>
          <Sel label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} options={[{ value: "pending", label: "Pending" }, { value: "in-progress", label: "In Progress" }, { value: "completed", label: "Completed" }]} />
          <div className="flex gap-3 pt-2">
            <Btn variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={saveAsgn} className="flex-1">{editAsgn ? "Save Changes" : "Add Assignment"}</Btn>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setAssignments((as) => as.filter((a) => a.id !== deleteId)); toast.success("Assignment deleted"); setDeleteId(null); }} title="Delete Assignment" message="Are you sure you want to delete this assignment?" />
    </div>
  );
}
