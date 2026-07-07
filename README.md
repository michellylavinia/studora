# Studora — Student Management Platform

A modern student management platform built with Next.js,
designed to help students manage courses, schedules, assignments, grades,
attendance, and academic progress through a clean and responsive interface.

## Tech used

- **Next.js 14** — App Router, JavaScript (no TypeScript)
- **Tailwind CSS** — utility classes for styling (this is the "existing CSS"
  setup that ships with the project — the original design was built entirely
  with Tailwind classes, so keeping Tailwind is what preserves the exact
  original look)
- **Recharts** — the bar charts on the Dashboard, Grades, and Attendance pages
- **lucide-react** — all icons
- **localStorage** — the app is a client-side demo. User accounts, courses,
  assignments, grades, attendance, profile, and settings are stored in
  `localStorage` and automatically restored on reload. Authentication is
  handled entirely on the client side without a real backend or database.
- **date-fns** — date formatting/math
- **clsx** — conditionally combining CSS classes
- **sonner** — the little toast notifications ("Course added!", etc.)

## Features

- 🔐 Authentication (Sign In & Sign Up)
- 📚 Course Management
- 📝 Assignment Tracking
- 📊 Grade Management & GPA Overview
- 📅 Attendance Tracking
- 👤 User Profile Management
- ⚙️ Application Settings
- 🌙 Dark & Light Mode
- 💾 Local data persistence using localStorage
- 📱 Responsive interface

## Project structure

```
app/
  layout.js        Root HTML layout + global styles
  page.js           Entry point — renders <App />
  globals.css       Tailwind directives + dark-mode background variable
components/
  App.jsx           Top-level state: login, courses, assignments, grades,
                     attendance, profile, settings — loads/saves everything
                     to localStorage and switches between pages
  AuthPage.jsx       Login / register / forgot-password screen
  Layout.jsx         Sidebar + top header shell
  Sidebar.jsx        Left navigation menu
  DashboardPage.jsx  Overview: stats, charts, today's classes, GPA, etc.
  CoursesPage.jsx    Course list + add/edit/delete modal
  SchedulePage.jsx   Weekly / today / calendar views of your timetable
  AssignmentsPage.jsx  Assignment list with filters + add/edit/delete
  GradesPage.jsx     GPA, grade chart, and grade records table
  AttendancePage.jsx Attendance stats, monthly chart, and calendar
  ProfilePage.jsx    Editable profile with avatar upload
  SettingsPage.jsx   Dark mode, notifications, password, reset data
  ui.jsx             Small shared building blocks (Button, Input, Select,
                     Textarea, Card, Badge, Modal, Toggle, etc.)
lib/
  data.js            Sample starting data (courses, assignments, grades…)
  storage.js         Tiny localStorage load/save helpers
  utils.js           GPA/attendance calculations and badge-color helpers
```

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Create a new account through the Sign Up page to access the dashboard. User
data is stored locally in your browser using localStorage, so registered
accounts remain available until the browser data is cleared or the application
data is reset.

> **Note:** This is a front-end demonstration project. Authentication is
> handled entirely on the client side and does not use a real backend or
> database.

## Future Improvements

- Multi-language support
- Backend integration
- Cloud database
- Email notifications
- Calendar synchronization
- Mobile application
