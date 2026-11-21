"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  CalendarCheck,
  Heart,
  Package,
  DollarSign,
  Clock,
  Loader2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import type { Rental, Equipment } from "@/Types";
import { authFetch } from "@/lib/api/authFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CustomerDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [favorites, setFavorites] = useState<Equipment[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load customer's data
  useEffect(() => {
    if (!session?.user?.email) return;

    async function loadAll() {
      try {
        const [rentalsRes, favsRes, equipRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/my-rentals?email=${session?.user?.email}`),
          authFetch(`${API_BASE_URL}/favorites?email=${session?.user?.email}`),
          authFetch(`${API_BASE_URL}/equipment`),
        ]);
        if (!rentalsRes.ok || !favsRes.ok || !equipRes.ok) throw new Error();

        setRentals(await rentalsRes.json());
        setFavorites(await favsRes.json());
        setEquipment(await equipRes.json());
        setError("");
      } catch {
        setError("Could not load dashboard data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [session?.user?.email]);

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

  // Computed stats
  const totalRentals = rentals.length;
  const activeRentals = rentals.filter(
    (r) => r.status.toLowerCase() === "confirmed" || r.status.toLowerCase() === "pending"
  ).length;
  const totalSpent = rentals
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const totalFavorites = favorites.length;
  const availableEquipment = equipment.filter(
    (e) => e.status === "Available" || e.status === "Approved"
  ).length;
  const recentRentals = rentals.slice(0, 5);

  const stats = [
    {
      label: "My Rentals",
      value: totalRentals,
      icon: CalendarCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      href: "/dashboard/customer/my-rentals",
    },
    {
      label: "Active Rentals",
      value: activeRentals,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      href: "/dashboard/customer/my-rentals",
    },
    {
      label: "Favorites",
      value: totalFavorites,
      icon: Heart,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      href: "/dashboard/customer/favorites",
    },
    {
      label: "Available Equipment",
      value: availableEquipment,
      icon: Package,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      href: "/all-equipment",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome back, {session.user.name?.split(" ")[0] || "Customer"}
        </h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          Here is an overview of your rentals and favorites.
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Total spent card */}
      <div className="rounded-[16px] border border-emerald-500/20 bg-[#0f1016] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[10px] bg-emerald-500/10">
            <DollarSign className="size-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">
              ৳{totalSpent.toLocaleString()}
            </p>
            <p className="text-sm text-[#a1a1aa]">Total spent on rentals</p>
          </div>
        </div>
      </div>

      {/* Recent rentals */}
      <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0f1016]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Rentals</h2>
          <Link
            href="/dashboard/customer/my-rentals"
            className="flex items-center gap-1 text-xs font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb]"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recentRentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <ShoppingBag className="size-8 text-[#52525b]" />
            <p className="text-sm text-[#71717a]">No rentals yet.</p>
            <Link
              href="/all-equipment"
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb]"
            >
              Browse equipment <ArrowRight className="size-3.5" />
            </Link>
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
                      {new Date(rental.startDate).toLocaleDateString()} –{" "}
                      {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {rental.paymentStatus === "paid" ? (
                    <CheckCircle2 className="size-4 text-green-400" />
                  ) : (
                    <XCircle className="size-4 text-amber-400" />
                  )}
                  <span className="text-sm font-medium text-white">
                    ৳{rental.totalAmount.toLocaleString()}
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
          { label: "My Rentals", href: "/dashboard/customer/my-rentals", icon: CalendarCheck },
          { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
          { label: "Browse Equipment", href: "/all-equipment", icon: Package },
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