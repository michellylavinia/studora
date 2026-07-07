import "./globals.css";

export const metadata = {
  title: "Studora | Student Management Platform",
  description: "Modern student management platform to manage courses, assignments, grades, schedules, and attendance.",
  icons: {
    icon: "/favicon.svg", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
