"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Users } from "lucide-react";
import type { User } from "@/Types";
import { authFetch } from "@/lib/api/authFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const roles = ["customer", "owner", "admin"] as const;

export default function AdminUsersPage() {
  const { data: session, isPending } = authClient.useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load all users from the backend
  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await authFetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error();
        const data: User[] = await response.json();
        setUsers(data);
        setError("");
      } catch {
        setError("Could not load users. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Change a user's role
  async function changeRole(userId: string, newRole: string) {
    setUpdatingId(userId);
    try {
      const response = await authFetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error();

      // Update the local list without reloading
      setUsers((current) =>
        current.map((u) =>
          u._id === userId ? { ...u, role: newRole as User["role"] } : u
        )
      );
      toast.success("Role updated", "The user's role has been changed.");
    } catch {
      toast.error("Failed", "Could not update the role. Try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  // Delete a user
  async function deleteUser(userId: string) {
    setDeletingId(userId);
    try {
      const response = await authFetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();

      setUsers((current) => current.filter((u) => u._id !== userId));
      toast.success("User deleted", "The user has been removed.");
    } catch {
      toast.error("Failed", "Could not delete the user. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#09090b] text-sm text-[#a1a1aa]">
        Loading dashboard…
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Users
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            All registered users. You can change roles or remove users.
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-[14px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
          {error}
          <button
            type="button"
            onClick={() => {
              setError("");
              setLoading(true);
            }}
            className="w-fit rounded-[10px] border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0f1016]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#71717a]">
            <Loader2 className="size-4 animate-spin" />
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-[#71717a]">
              <Users className="size-5" />
            </span>
            <p className="font-medium text-white">No users yet</p>
            <p className="mt-1 text-sm text-[#71717a]">
              Registered users will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="px-3 text-xs text-[#71717a] uppercase">
                  User
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Email
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Role
                </TableHead>
                <TableHead className="hidden text-xs text-[#71717a] uppercase xl:table-cell">
                  Joined
                </TableHead>
                <TableHead className="px-3 text-right text-xs text-[#71717a] uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const role = user.role || "customer";
                return (
                  <TableRow
                    key={user._id}
                    className="border-white/10 hover:bg-white/[0.03]"
                  >
                    {/* Image + name */}
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.image}
                            alt={user.name}
                            className="size-11 shrink-0 rounded-full border border-white/10 object-cover"
                          />
                        ) : (
                          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-bold text-white">
                            {(user.name?.charAt(0) || "U").toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {user.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#71717a]">
                            {user.emailVerified ? "Verified" : "Not verified"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-[#d4d4d8]">{user.email}</TableCell>

                    <TableCell>
                      <select
                        value={role}
                        disabled={updatingId === user._id}
                        onChange={(e) => changeRole(user._id, e.target.value)}
                        className="rounded-[8px] border border-white/10 bg-[#0c0d12] px-2 py-1.5 text-xs text-white outline-none transition-colors focus:border-[#3b82f6] disabled:opacity-50"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </option>
                        ))}
                      </select>
                    </TableCell>

                    <TableCell className="hidden text-[#d4d4d8] xl:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => deleteUser(user._id)}
                          disabled={deletingId === user._id}
                          title="Delete"
                          className="flex items-center gap-1.5 rounded-[10px] border border-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === user._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                          <span className="hidden xl:inline">Delete</span>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}