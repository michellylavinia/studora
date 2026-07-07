"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";
import { Card, Btn, Toggle, ConfirmModal, PgHeader } from "./ui";

const notifItems = [
  { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates and alerts via email" },
  { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
  { key: "assignmentReminders", label: "Assignment Reminders", desc: "Get reminded 24h before deadlines" },
  { key: "gradeAlerts", label: "Grade Alerts", desc: "Notify when new grades are posted" },
];

export default function SettingsPage({ settings, setSettings, onClearData }) {

  const [clearOpen, setClearOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PgHeader title="Settings" subtitle="Customize your Studora experience" />

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Appearance</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-600 rounded-xl shadow-sm">
                {settings.darkMode ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark theme</p>
              </div>
            </div>
            <Toggle checked={settings.darkMode} onChange={(v) => setSettings((s) => ({ ...s, darkMode: v }))} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Language</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select your preferred interface language</p>
            </div>
            <select className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={settings.language} onChange={() => {toast.info("🌐 Coming Soon", { description: "Multi-language support will be available in Studora v1.1.", });}}>
              <option value="English">English (Default)</option>
              <option disabled>────────────</option>
              <option disabled>Indonesian (Coming Soon)</option>
              <option disabled>Spanish (Coming Soon)</option>
              <option disabled>French (Coming Soon)</option>
              <option disabled>German (Coming Soon)</option>
              <option disabled>Chinese (Coming Soon)</option>
              <option disabled>Arabic (Coming Soon)</option>
              <option disabled>Portuguese (Coming Soon)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Notifications</h3>
        <div className="space-y-3">
          {notifItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key]} onChange={(v) => setSettings((s) => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Account Security</h3>
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">🔒 Change Password</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">This feature will be available in a future update.</p>
          <Btn className="mt-5" disabled>Coming Soon</Btn>
        </div>
      </Card>

      <Card className="p-6 border-red-200 dark:border-red-900/40 border">
        <h3 className="font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reset All Data</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Delete all courses, schedules, assignments, grades, attendance records, and profile data from this device.</p>
          </div>
          <Btn variant="danger" size="sm" onClick={() => setClearOpen(true)} className="flex-shrink-0">Reset Data</Btn>
        </div>
      </Card>

      <ConfirmModal open={clearOpen} onClose={() => setClearOpen(false)} onConfirm={onClearData} title="Reset All Data" message="This action will permanently delete all your local data. This cannot be undone." />
    </div>
  );
}
