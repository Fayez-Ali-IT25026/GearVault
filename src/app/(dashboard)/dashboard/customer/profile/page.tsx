"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Loader2, Pencil, Save, X, User, Mail, Shield, Calendar } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile from backend
  useEffect(() => {
    if (!session?.user?.id) return;

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${session?.user?.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setName(data.name || "");
        setImage(data.image || "");
      } catch {
        // Fall back to session data
        setName(session?.user?.name || "");
        setImage(session?.user?.image || "");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [session?.user?.id, session?.user?.name, session?.user?.image]);

  // Save profile changes
  async function handleSave() {
    if (!session?.user?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setName(data.name || name);
      setImage(data.image || image);
      setEditing(false);
      toast.success("Profile updated", "Your changes were saved.");
    } catch {
      toast.error("Failed", "Could not update profile. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditing(false);
    // Reset to session data
    setName(session?.user?.name || "");
    setImage(session?.user?.image || "");
  }

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#09090b] text-sm text-[#a1a1aa]">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading profile…
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const initial = (user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase();

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          View and update your personal information.
        </p>
      </div>

      {/* Profile card */}
      <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0f1016]">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#3b82f6]/40 via-[#8b5cf6]/30 to-[#ec4899]/30" />

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}
            <div className="relative">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#0f1016] bg-[#3b82f6] text-2xl font-bold text-white shadow-lg">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={name} className="size-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <span className="absolute bottom-1 right-1 flex size-6 items-center justify-center rounded-full border-2 border-[#0f1016] bg-green-500">
                <span className="size-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Name + role */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{name || user.name}</h2>
              <p className="text-sm text-[#a1a1aa]">{user.email}</p>
              <span className="mt-2 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                Customer
              </span>
            </div>

            {/* Edit button */}
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-[10px] bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
              >
                <Pencil className="size-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="rounded-[20px] border border-white/10 bg-[#0f1016] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Personal Details</h3>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[10px] border border-white/10 bg-[#0c0d12] px-3 py-2.5 text-sm text-white placeholder:text-[#52525b] outline-none transition-colors focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">
                Profile Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-[10px] border border-white/10 bg-[#0c0d12] px-3 py-2.5 text-sm text-white placeholder:text-[#52525b] outline-none transition-colors focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-[10px] border border-white/10 bg-[#0c0d12]/50 px-3 py-2.5 text-sm text-[#71717a] outline-none cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-[#52525b]">Email cannot be changed.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-[10px] bg-[#3b82f6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-[10px] border border-white/10 px-4 py-2.5 text-sm font-medium text-[#d4d4d8] transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="size-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={<User className="size-4" />} label="Full Name" value={name || user.name} />
            <InfoItem icon={<Mail className="size-4" />} label="Email" value={user.email} />
            <InfoItem icon={<Shield className="size-4" />} label="Role" value="Customer" />
            <InfoItem icon={<Calendar className="size-4" />} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
          </div>
        )}
      </div>
    </div>
  );
}

/** A small info display block. */
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-white/5 bg-white/[0.02] p-4">
      <span className="mt-0.5 text-[#71717a]">{icon}</span>
      <div>
        <p className="text-xs text-[#71717a]">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}