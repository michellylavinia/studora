"use client";

import { useState } from "react";
import { registerAccount, loginAccount } from "../lib/storage";
import { toast } from "sonner";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Card, Btn, Inp } from "./ui";

export default function AuthPage({ onLogin }) {
  const [view, setView] = useState("login"); // "login" | "register" | "forgot"
  const [form, setForm] = useState({ email: "", password: "", name: "", confirm: "", rememberMe: false });
  const [showPass, setShowPass] = useState(false);
  const [errs, setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (view !== "forgot") {
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 6) e.password = "At least 6 characters required";
    }
    if (view === "register") {
      if (!form.name) e.name = "Full name is required";
      if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    }
    setErrs(e);
    return !Object.keys(e).length;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (view === "forgot") {
      toast.success("Password reset link sent to your email!");
      setView("login");
      return;
    }

    if (view === "register") {
      const result = registerAccount({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Account created successfully!");

      setView("login");

      setForm({
        email: "",
        password: "",
        name: "",
        confirm: "",
        rememberMe: false,
      });

      return;
    }

    const account = loginAccount(form.email, form.password);

    if (!account) {
      toast.error("Invalid email or password.");
      return;
    }

    toast.success(`Welcome back to Studora, ${account.name}! 👋`);

    onLogin(account);
  };
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5 translate-x-7">
            <Image
              src="/logo-light.svg"
              alt="Studora"
              width={185}
              height={48}
              priority
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="select-none pointer-events-none h-11 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {view === "login" ? "Welcome back" : view === "register" ? "Create your account" : "Reset password"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            {view === "login" ? "Sign in to your Studora dashboard" : view === "register" ? "Start managing your academic life with Studora" : "Enter your email to receive a reset link"}
          </p>
        </div>

        <Card className="p-8 shadow-xl shadow-blue-900/5">
          <form onSubmit={submit} className="space-y-4">
            {view === "register" && (
              <Inp label="Full Name" placeholder="Your Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errs.name} />
            )}
            <Inp label="Email Address" type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errs.email} />
            {view !== "forgot" && (
              <div className="relative">
                <Inp label="Password" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} error={errs.password} />
                <button type="button" className="absolute right-3 top-7 text-slate-400 hover:text-slate-600" onClick={() => setShowPass((s) => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}
            {view === "register" && (
              <Inp label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} error={errs.confirm} />
            )}
            {view === "login" && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600" checked={form.rememberMe} onChange={(e) => setForm((f) => ({ ...f, rememberMe: e.target.checked }))} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <button type="button" onClick={() => setView("forgot")} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">Forgot password?</button>
              </div>
            )}
            <Btn type="submit" className="w-full mt-2" size="lg">
              {view === "login" ? "Sign In →" : view === "register" ? "Create Account →" : "Send Reset Link →"}
            </Btn>
          </form>
          <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {view === "login" ? (
              <>
                {"Don't have an account? "}
                <button onClick={() => setView("register")} className="text-blue-600 font-semibold hover:text-blue-700">Sign up free</button>
              </>
            ) : view === "register" ? (
              <>
                {"Already have an account? "}
                <button onClick={() => setView("login")} className="text-blue-600 font-semibold hover:text-blue-700">Sign in</button>
              </>
            ) : (
              <button onClick={() => setView("login")} className="text-blue-600 font-semibold hover:text-blue-700">← Back to sign in</button>
            )}
          </div>
        </Card>
        <p className="text-center text-xs text-slate-400 mt-4">Create an account first before signing in.</p>
      </div>
    </div>
  );
}
