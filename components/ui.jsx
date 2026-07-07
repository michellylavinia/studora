"use client";

import { clsx } from "clsx";
import { X } from "lucide-react";

// ─── Button ───────────────────────────────────────────────────────────────────

export function Btn({ variant = "primary", size = "md", className = "", children, ...p }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 cursor-pointer";
  const v = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-600/20",
    secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
  }[variant];
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }[size];
  return (
    <button className={clsx(base, v, s, className)} {...p}>
      {children}
    </button>
  );
}

// ─── Text input ───────────────────────────────────────────────────────────────

export function Inp({ label, error, icon, className = "", ...p }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>}
        <input
          className={clsx(
            "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
            icon && "pl-10",
            error && "border-red-500",
            className
          )}
          {...p}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function Sel({ label, options, className = "", ...p }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{label}</label>}
      <select
        className={clsx(
          "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
          className
        )}
        {...p}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export function Txa({ label, className = "", ...p }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{label}</label>}
      <textarea
        className={clsx(
          "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none",
          className
        )}
        {...p}
      />
    </div>
  );
}

// ─── Card / Badge ─────────────────────────────────────────────────────────────

export function Card({ children, className = "", onClick }) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm",
        onClick && "cursor-pointer hover:shadow-md transition-shadow duration-200",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Badge({ children, className = "", style }) {
  return (
    <span style={style} className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", className)}>
      {children}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 rounded-t-2xl z-10">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={() => { onConfirm(); onClose(); }}>Delete</Btn>
      </div>
    </Modal>
  );
}

// ─── Misc small pieces ────────────────────────────────────────────────────────

export function StatCard({ icon, label, value, subtitle, color = "blue" }) {
  const cm = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={clsx("p-3 rounded-xl", cm[color] || cm.blue)}>{icon}</div>
      </div>
    </Card>
  );
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl mb-4 text-slate-400">{icon}</div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-xs">{desc}</p>
      {action}
    </div>
  );
}

export function PgHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Toggle({ checked, onChange }) {
  return (
    <div
      className={clsx("relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0", checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600")}
      onClick={() => onChange(!checked)}
    >
      <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200", checked ? "translate-x-6" : "translate-x-1")} />
    </div>
  );
}
