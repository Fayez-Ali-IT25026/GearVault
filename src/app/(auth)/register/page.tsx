
"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
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
  Briefcase,
  CheckCircle2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import type { SignupRole } from "@/Types";





export default function RegisterPage() {



    const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // "customer" or "owner". This is saved in the user document.
  const [role, setRole] = useState<SignupRole>("customer");

  // Profile image: we upload the file to imgbb and keep its URL here.
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", "Please choose an image under 5 MB.");
      event.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey || apiKey === "your_imgbb_api_key_here") {
      toast.error("Image upload not set up", "Add NEXT_PUBLIC_IMGBB_API_KEY to .env.");
      event.target.value = "";
      return;
    }

    // Upload to imgbb and save the returned URL.
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Upload failed");

      setImage(data.data.url);
      toast.success("Image uploaded", "Your profile photo is ready.");
    } catch (err) {
      toast.error("Upload failed", err instanceof Error ? err.message : "Try again.");
      event.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const result = new FormData(form);

    const name = result.get("name") as string;
    const email = result.get("email") as string;
    const image = result.get("image") as string;
    const password = result.get("password") as string;
    const confirmPassword = result.get("confirmPassword") as string;
    // The hidden input keeps the selected role inside the form.
    const selectedRole = result.get("role") as SignupRole;

    // 1. Check the form first.
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      toast.error("Missing details", "Please fill in all required fields.");
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password needs 6+ characters, one uppercase and one lowercase letter.");
      toast.error("Weak password", "Use 6+ characters with one uppercase and one lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match", "Please re-enter your password.");
      return;
    }

    // 2. Only then create the account.
    const { error: signUpError } = await authClient.signUp.email({
      name: name, // required, The name of the user.
      email: email, // required, The email address of the user.
      password: password, // required, The password of the user.
      image: image, // An optional profile image of the user.
      role: selectedRole, // "customer" or "owner" - saved in the database.
      callbackURL: '/login', // An optional URL to redirect to after the user signs up.
    });

    if (signUpError) {
      const message = signUpError.message || "Unable to create your account.";
      setError(message);
      toast.error("Registration failed", message);
      return;
    }

    setSuccess("Account created! You can now sign in.");
    toast.success("Account created!", "You can now sign in with your email.");

    router.push("/login");
    router.refresh();
  };

  const inputClass =
    "w-full bg-[#0c0d12] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-white/20";




const handelGoogleRegister = async () => {


 const data = await authClient.signIn.social({
    provider: "google",
  });
    }




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
          onClick={handelGoogleRegister}
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

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I want to join as
              </label>

              {/* This hidden input sends the selected role with the form. */}
              <input type="hidden" name="role" value={role} />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition-all duration-200 ${
                    role === "customer"
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>
                    Customer
                    <span className="block text-xs font-normal text-gray-500">
                      Rent equipment
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition-all duration-200 ${
                    role === "owner"
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20"
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>
                    Equipment Owner
                    <span className="block text-xs font-normal text-gray-500">
                      List equipment
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Profile image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile image
                <span className="text-gray-500 font-normal"> (optional)</span>
              </label>

              {/* The uploaded imgbb URL is sent with the form as "image". */}
              <input type="hidden" name="image" value={image} />

              <div className="flex items-center gap-4">
                {image ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Profile preview"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove image"
                      className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-white/15 bg-[#0c0d12] text-gray-500">
                    <ImagePlus className="size-6" />
                  </div>
                )}

                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#0c0d12] px-4 py-3.5 text-sm text-gray-400 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-white">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {uploadingImage ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-blue-400" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 text-blue-400" />
                      {image ? "Change photo" : "Choose from computer"}
                    </>
                  )}
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                PNG or JPG, up to 5 MB.
              </p>
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
              disabled={uploadingImage}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 group disabled:cursor-not-allowed disabled:opacity-60"
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
