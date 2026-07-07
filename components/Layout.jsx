"use client";

import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Layout({ children, page, setPage, profile, onLogout, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="min-h-screen bg-background">
      <Sidebar page={page} setPage={setPage} profile={profile} onLogout={onLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 px-4 lg:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
            </div>
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors overflow-hidden" onClick={() => setPage("profile")}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="av" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
