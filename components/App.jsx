"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

import AuthPage from "./AuthPage";
import Layout from "./Layout";
import DashboardPage from "./DashboardPage";
import CoursesPage from "./CoursesPage";
import SchedulePage from "./SchedulePage";
import AssignmentsPage from "./AssignmentsPage";
import GradesPage from "./GradesPage";
import AttendancePage from "./AttendancePage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";

import { initCourses, initAssignments, initGrades, initProfile, initSettings, generateAttendance } from "@/lib/data";
import { KEYS, load, save } from "@/lib/storage";

const PAGE_META = {
  dashboard: { title: "Dashboard", subtitle: "Overview of your academic progress" },
  courses: { title: "Course Management", subtitle: "Manage your enrolled courses" },
  schedule: { title: "Class Schedule", subtitle: "Your weekly timetable" },
  assignments: { title: "Assignments", subtitle: "Track your tasks and deadlines" },
  grades: { title: "Grade Tracker", subtitle: "Monitor your academic performance" },
  attendance: { title: "Attendance", subtitle: "Track your class attendance" },
  profile: { title: "Profile", subtitle: "Your personal information" },
  settings: { title: "Settings", subtitle: "Customize your experience" },
};

export default function App() {
  // These start as the "safe" defaults (not logged in, sample data) and then
  // get hydrated from localStorage once the component mounts in the browser.
  const [hydrated, setHydrated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    studentId: "",
    major: "",
    semester: "",
  });
  const [settings, setSettings] = useState(initSettings);

  // Load everything from localStorage once, on the client only.
  useEffect(() => {
    setIsLoggedIn(load(KEYS.loggedIn, false));
    setCourses(load(KEYS.courses, []));
    setAssignments(load(KEYS.assignments, []));
    setGrades(load(KEYS.grades, []));
    setAttendance(load(KEYS.attendance, []));

    setProfile(
      load(KEYS.profile, {
        name: "",
        email: "",
        studentId: "",
        major: "",
        semester: "",
      })
    );
    setSettings(load(KEYS.settings, initSettings));
    setHydrated(true);
  }, []);

  // Persist each slice of state whenever it changes (after initial hydration).
  useEffect(() => { if (hydrated) save(KEYS.loggedIn, isLoggedIn); }, [hydrated, isLoggedIn]);
  useEffect(() => { if (hydrated) save(KEYS.courses, courses); }, [hydrated, courses]);
  useEffect(() => { if (hydrated) save(KEYS.assignments, assignments); }, [hydrated, assignments]);
  useEffect(() => { if (hydrated) save(KEYS.grades, grades); }, [hydrated, grades]);
  useEffect(() => { if (hydrated) save(KEYS.attendance, attendance); }, [hydrated, attendance]);
  useEffect(() => { if (hydrated) save(KEYS.profile, profile); }, [hydrated, profile]);
  useEffect(() => { if (hydrated) save(KEYS.settings, settings); }, [hydrated, settings]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  const logout = () => { setIsLoggedIn(false); setPage("dashboard"); toast.success("Signed out successfully"); };

  const clearData = () => {
    setCourses([]);
    setAssignments([]);
    setGrades([]);
    setAttendance([]);
    toast.success("Data reset to defaults!");
  };

  // Avoid rendering with server-default state before we've checked localStorage,
  // which would otherwise briefly flash the login page on every reload.
  if (!hydrated) return null;

  if (!isLoggedIn) return (
    <>
      <Toaster position="top-right" richColors />
      <AuthPage onLogin={() => setIsLoggedIn(true)} />
    </>
  );

  const meta = PAGE_META[page];

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage courses={courses} assignments={assignments} grades={grades} attendance={attendance} profile={profile} setPage={setPage} />;
      case "courses":
        return <CoursesPage courses={courses} setCourses={setCourses} assignments={assignments} setAssignments={setAssignments} grades={grades} setGrades={setGrades} attendance={attendance} setAttendance={setAttendance} />;
      case "schedule":
        return <SchedulePage courses={courses} />;
      case "assignments":
        return <AssignmentsPage assignments={assignments} setAssignments={setAssignments} courses={courses} />;
      case "grades":
        return <GradesPage grades={grades} setGrades={setGrades} courses={courses} />;
      case "attendance":
        return <AttendancePage attendance={attendance} courses={courses} />;
      case "profile":
        return <ProfilePage profile={profile} setProfile={setProfile} />;
      case "settings":
        return <SettingsPage settings={settings} setSettings={setSettings} onClearData={clearData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <Layout page={page} setPage={setPage} profile={profile} onLogout={logout} title={meta.title} subtitle={meta.subtitle}>
        {renderPage()}
      </Layout>
    </>
  );
}
