"use client";

import Image from "next/image";
import { clsx } from "clsx";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  UserCheck, User, Settings, LogOut, Award,
} from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "grades", label: "Grade Tracker", icon: Award },
  { id: "attendance", label: "Attendance", icon: UserCheck },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ page, setPage, profile, onLogout, open, onClose }) {
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-slate-900 dark:bg-slate-950 flex flex-col z-50 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full", "lg:translate-x-0"
        )}
      >
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Studora Logo"
              width={180}
              height={36}
              draggable={false}
              onContextMenu={(e)=>e.preventDefault()}
              className="select-none pointer-events-none"
            />
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); onClose(); }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                  active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="av" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile.name}</p>
              <p className="text-slate-500 text-xs truncate">{profile.studentId}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 text-sm font-medium transition-colors">
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
