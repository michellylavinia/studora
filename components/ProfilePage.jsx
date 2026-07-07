"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { User, Hash, Mail, Phone, BookOpen, GraduationCap, Edit2, Camera, BookMarked } from "lucide-react";
import { Card, Btn, Inp, Txa, Badge, PgHeader } from "./ui";

export default function ProfilePage({ profile, setProfile }) {
  const [form, setForm] = useState(profile);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef(null);

  const save = () => {
    if (
      !form.name.trim() ||
      !form.studentId.trim() ||
      !form.email.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const avatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const initials = form.name
    ? form.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const fields = [
    { label: "Full Name", value: profile.name, icon: <User size={14} /> },
    { label: "Student ID", value: profile.studentId, icon: <Hash size={14} /> },
    { label: "Email", value: profile.email, icon: <Mail size={14} /> },
    { label: "Phone", value: profile.phone, icon: <Phone size={14} /> },
    { label: "Major", value: profile.major, icon: <BookOpen size={14} /> },
    { label: "Year", value: profile.year, icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <PgHeader title="Profile" subtitle="Manage your personal information" />
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-600/30">
              {form.avatar ? <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white text-3xl font-bold">{initials}</span>}
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"><Camera size={14} /></button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={avatarChange} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{profile.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">{profile.major} · {profile.year}</p>
            <p className="text-sm text-slate-400 mt-1">{profile.email}</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold">ID: {profile.studentId}</Badge>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {!editing ? (
              <Btn onClick={() => { setForm(profile); setEditing(true); }}><Edit2 size={14} />Edit Profile</Btn>
            ) : (
              <>
                <Btn variant="ghost" onClick={() => {setForm(profile); setEditing(false); }}>Cancel</Btn>
                <Btn onClick={save}>Save</Btn>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inp label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Inp label="Student ID" value={form.studentId} onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))} />
              <Inp label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              <Inp label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <Inp label="Major" value={form.major} onChange={(e) => setForm((f) => ({ ...f, major: e.target.value }))} />
              <Inp label="Year" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
            </div>
            <Txa label="Bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Tell us about yourself..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div className="flex items-center gap-2 text-slate-400 mb-1">{f.icon}<span className="text-xs font-bold uppercase tracking-wide">{f.label}</span></div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{f.value || "—"}</p>
              </div>
            ))}
            {profile.bio && (
              <div className="sm:col-span-2 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div className="flex items-center gap-2 text-slate-400 mb-1"><BookMarked size={14} /><span className="text-xs font-bold uppercase tracking-wide">Bio</span></div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
