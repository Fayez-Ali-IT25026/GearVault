"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowRight, Package } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PaymentStatus = "unpaid" | "paid";
type BookingStatus = "pending" | "confirmed";

function statusBadgePayment(status: PaymentStatus) {
  if (status === "paid") {
    return "border-green-500/20 bg-green-500/10 text-green-300";
  }
  return "border-red-500/20 bg-red-500/10 text-red-300";
}

function statusBadgeBooking(status: BookingStatus) {
  if (status === "confirmed") {
    return "border-green-500/20 bg-green-500/10 text-green-300";
  }
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

export default function MyRentalsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [rentals, setRentals] = useState<Array<{
    _id: string;
    equipmentImage: string;
    equipmentName: string;
    startDate: string;
    endDate: string;
    quantity: number;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    equipmentCategory: string;
    equipmentLocation: string;
    contact: string;
    notes: string;
  }>>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch rentals from the backend
  useEffect(() => {
    if (!session?.user?.email) return;

    async function fetchRentals() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/my-rentals?email=${session?.user?.email}`
        );
        if (!response.ok) throw new Error();

        const data = await response.json();
        setRentals(data);
        setError("");
      } catch {
        setError("Could not load your rentals. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    fetchRentals();
  }, [session?.user?.email, reloadKey]);

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

  // Empty state - no bookings yet
  if (rentals.length === 0 && !loading) {
    return (
      <div className="py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#0f1016] text-[#71717a] mb-4">
          <Loader2 className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No rentals yet</h2>
        <p className="text-[#a1a1aa] mb-6">
          You are yet to book any equipment. Browse available equipment and make your first booking.
        </p>
        <Link
          href="/all-equipment"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
        >
          Browse equipment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Rentals
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Your booked equipment
          </p>
        </div>

        <Link
          href="/all-equipment"
          className="flex w-fit items-center gap-2 rounded-[12px] bg-[#3b82f6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
            <span className="ml-2 text-xs font-medium text-white">Browse all</span>
          </svg>
        </Link>
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
              setReloadKey((key) => key + 1);
            }}
            className="w-fit rounded-[10x] border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0f1016]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#71717a]">
            <Loader2 className="size-4 animate-spin" />
            Loading your rentals…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="px-3 text-xs text-[#71717a] uppercase">
                  Equipment
                </TableHead>
                <TableHead className="hidden text-xs text-[#71717a] uppercase xl:table-cell">
                  Category
                </TableHead>
                <TableHead className="hidden text-xs text-[#71717a] uppercase xl:table-cell">
                  Condition
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Booked dates
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Days
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Qty
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Total (৳)
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Booking status
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Payment status
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Location
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Contact
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rentals.map((rental) => (
                <TableRow
                  key={rental._id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {rental.equipmentImage ? (
                        <img
                          src={rental.equipmentImage}
                          alt={rental.equipmentName}
                          className="size-11 shrink-0 rounded-[10px] border border-white/10 object-cover"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] text-[#52525b]">
                          <Package className="size-5" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {rental.equipmentName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#71717a]">
                          {rental.equipmentCategory}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden text-[#d4d4d8] xl:table-cell">
                    {rental.equipmentCategory}
                  </TableCell>
                  <TableCell className="hidden text-[#d4d4d8] xl:table-cell">
                    {/* We'll show a generic condition indicator */}
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${statusBadgeBooking(rental.status)}`}
                    >
                      {rental.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-white">
                      {new Date(rental.startDate).toLocaleDateString()} -
                      {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[#71717a]">
                      {Math.ceil(
                        new Date(rental.endDate).getTime() -
                          new Date(rental.startDate).getTime()
                        ) /
                        86400000 +
                        1} days
                    </p>
                  </TableCell>

                  <TableCell className="text-[#d4d4d8]">{rental.quantity}</TableCell>
                  <TableCell className="font-medium text-white">{rental.totalAmount.toLocaleString()}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadgeBooking(rental.status)}`}
                    >
                      {rental.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadgePayment(rental.paymentStatus)}`}
                    >
                      {rental.paymentStatus}
                    </span>
                  </TableCell>

                  <TableCell className="text-[#d4d4d8]">{rental.equipmentLocation}</TableCell>
                  <TableCell className="text-[#d4d4d8]">{rental.contact}</TableCell>
                  <TableCell className="text-xs text-[#71717a] truncate">{rental.notes || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}