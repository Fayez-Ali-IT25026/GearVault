"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  Clock,
  Loader2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { AdminRental, DashboardStats } from "@/Types";
import { authFetch } from "@/lib/api/authFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the rental list (for the "Recent Rentals" table) and the totals.
  useEffect(() => {
    async function loadAll() {
      try {
        const [rentalsRes, statsRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/rentals`),
          authFetch(`${API_BASE_URL}/admin-stats`),
        ]);
        if (!rentalsRes.ok || !statsRes.ok) throw new Error();

        setRentals(await rentalsRes.json());
        setStats(await statsRes.json());
        setError("");
      } catch {
        setError("Could not load dashboard data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#09090b] text-sm text-[#a1a1aa]">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading dashboard…
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Totals come from the backend, so we don't count the lists here.
  const totalUsers = stats?.totalUsers ?? 0;
  const totalEquipment = stats?.totalEquipment ?? 0;
  const totalBookings = stats?.totalBookings ?? 0;
  const pendingApprovals = stats?.pendingApprovals ?? 0;
  const completedRentals = stats?.completedRentals ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const recentRentals = rentals.slice(0, 5);

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      href: "/dashboard/admin/users",
    },
    {
      label: "Total Equipment",
      value: totalEquipment,
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      href: "/dashboard/admin/equipment",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: ClipboardList,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      href: "/dashboard/admin/rentals",
    },
    {
      label: "Pending Approvals",
      value: pendingApprovals,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      href: "/dashboard/admin/equipment",
    },
    {
      label: "Completed Rentals",
      value: completedRentals,
      icon: CheckCircle2,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      href: "/dashboard/admin/rentals",
    },
    {
      label: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      href: "/dashboard/admin/rentals",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          Overview of the GearVault platform.
        </p>
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group rounded-[16px] border ${stat.border} bg-[#0f1016] p-5 transition-colors hover:bg-white/[0.03]`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex size-10 items-center justify-center rounded-[10px] ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <ArrowRight className="size-4 text-[#52525b] transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-[#a1a1aa]">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Monthly Bookings Chart */}
          <div className="rounded-[16px] border border-white/10 bg-[#0f1016] p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Monthly Bookings</h2>
            <ChartContainer
              config={{
                count: { label: "Bookings", color: "#3b82f6" },
              }}
              className="h-64"
            >
              <BarChart data={stats.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Monthly Earnings Chart */}
          <div className="rounded-[16px] border border-white/10 bg-[#0f1016] p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Monthly Earnings (৳)</h2>
            <ChartContainer
              config={{
                amount: { label: "Earnings", color: "#22c55e" },
              }}
              className="h-64"
            >
              <LineChart data={stats.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Recent rentals */}
      <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0f1016]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Rentals</h2>
          <Link
            href="/dashboard/admin/rentals"
            className="flex items-center gap-1 text-xs font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb]"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recentRentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <ClipboardList className="size-8 text-[#52525b]" />
            <p className="text-sm text-[#71717a]">No rentals yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentRentals.map((rental) => (
              <div
                key={rental._id}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {rental.equipmentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rental.equipmentImage}
                      alt={rental.equipmentName}
                      className="size-10 shrink-0 rounded-[8px] border border-white/10 object-cover"
                    />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03] text-[#52525b]">
                      <Package className="size-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {rental.equipmentName}
                    </p>
                    <p className="truncate text-xs text-[#71717a]">
                      {rental.customerName} · ৳{rental.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {rental.paymentStatus === "paid" ? (
                    <CheckCircle2 className="size-4 text-green-400" />
                  ) : (
                    <XCircle className="size-4 text-amber-400" />
                  )}
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                      rental.status.toLowerCase() === "confirmed"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {rental.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
          { label: "Manage Equipment", href: "/dashboard/admin/equipment", icon: Package },
          { label: "View All Rentals", href: "/dashboard/admin/rentals", icon: ClipboardList },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-[#0f1016] px-5 py-4 transition-colors hover:bg-white/[0.03]"
          >
            <link.icon className="size-5 text-[#3b82f6]" />
            <span className="text-sm font-medium text-white">{link.label}</span>
            <ArrowRight className="ml-auto size-4 text-[#52525b]" />
          </Link>
        ))}
      </div>
    </div>
  );
}