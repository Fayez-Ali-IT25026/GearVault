
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ImagePlus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const image = data.get("image") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password needs 6+ characters, one uppercase and one lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess("Form validated successfully! Connect your authentication next.");
  };

  const inputClass =
    "w-full bg-[#0c0d12] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-white/20";

  return (
    <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-[460px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tight">
            Gear<span className="text-blue-500">Vault</span>
          </span>
        </Link>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-[#11131a]/90 backdrop-blur-xl shadow-2xl shadow-black/40 p-6 sm:p-9">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Join GearVault and start renting smarter.
            </p>
          </div>

          {/* Google button - connect provider separately */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors text-sm font-medium"
          >
            <span className="font-bold text-lg">G</span>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Or register with email
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Profile image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile image URL
                <span className="text-gray-500 font-normal"> (optional)</span>
              </label>
              <div className="relative">
                <ImagePlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                At least 6 characters, one uppercase and one lowercase letter.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle2 size={17} />
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 group"
            >
              Create Account
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-7">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 GearVault. All rights reserved.
        </p>
      </div>
    </main>
  );
}
