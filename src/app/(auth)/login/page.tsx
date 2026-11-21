
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const result = new FormData(form);

    const email = result.get("email") as string;
    const password = result.get("password") as string;


    const { error: signInError } = await authClient.signIn.email({
    email: email, // required, The email address of the user.
    password: password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
    rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
    callbackURL: "/", // An optional URL to redirect to after the user signs in. (optional)
});



    if (!email || !password) {
      setError("Please enter your email and password.");
      toast.error("Missing details", "Please enter your email and password.");
      return;
    }

    if (signInError) {
      const message = signInError.message || "Invalid email or password.";
      setError(message);
      toast.error("Sign in failed", message);
      return;
    }

    setSuccess("Form validated successfully! ");
    toast.success("Welcome back!", "You are now signed in.");
  };

  const inputClass =
    "w-full bg-[#0c0d12] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-white/20";


      const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };




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

        {/* Login card */}
        <div className="rounded-2xl border border-white/10 bg-[#11131a]/90 backdrop-blur-xl shadow-2xl shadow-black/40 p-6 sm:p-9">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-blue-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Sign in to continue to your GearVault account.
            </p>
          </div>

          {/* Google login - connect provider separately */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors text-sm font-medium"
          >
            <span className="font-bold text-lg">G</span>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
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
              Sign In
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400 mt-7">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Create account
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
