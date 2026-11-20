"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Package } from "lucide-react";
import type { OwnerRental } from "@/Types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function paymentBadge(status: string) {
  if (status === "paid") return "border-green-500/20 bg-green-500/10 text-green-300";
  if (status === "Failed") return "border-red-500/20 bg-red-500/10 text-red-300";
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

function bookingBadge(status: string) {
  if (status === "Confirmed" || status === "confirmed") return "border-green-500/20 bg-green-500/10 text-green-300";
  if (status === "Completed" || status === "completed") return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  if (status === "Cancelled" || status === "cancelled") return "border-red-500/20 bg-red-500/10 text-red-300";
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

export default function OwnerEquipmentRentalsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [rentals, setRentals] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load rentals for this owner's equipment
  useEffect(() => {
    if (!session?.user?.id) return;

    async function loadRentals() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/owner-rentals?ownerId=${session?.user?.id}`
        );
        if (!res.ok) throw new Error();
        const data: OwnerRental[] = await res.json();
        setRentals(data);
        setError("");
      } catch {
        setError("Could not load rentals. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadRentals();
  }, [session?.user?.id]);

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
            Equipment Rentals
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Customers who booked your equipment.
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
            Loading rentals…
          </div>
        ) : rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-[#71717a]">
              <Package className="size-5" />
            </span>
            <p className="font-medium text-white">No rentals yet</p>
            <p className="mt-1 text-sm text-[#71717a]">
              When customers book your equipment, they will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="px-3 text-xs text-[#71717a] uppercase">
                  Customer
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Equipment
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Rental Duration
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Qty
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Booking Amount
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Payment Status
                </TableHead>
                <TableHead className="px-3 text-xs text-[#71717a] uppercase">
                  Booking Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rentals.map((rental) => (
                <TableRow
                  key={rental._id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  {/* Customer */}
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {rental.customerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rental.customerImage}
                          alt={rental.customerName}
                          className="size-10 shrink-0 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-bold text-white">
                          {(rental.customerName?.charAt(0) || "U").toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {rental.customerName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#71717a]">
                          {rental.customerEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Equipment */}
                  <TableCell>
                    <div className="flex items-center gap-3">
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
                      <p className="truncate font-medium text-white">
                        {rental.equipmentName}
                      </p>
                    </div>
                  </TableCell>

                  {/* Rental Duration */}
                  <TableCell>
                    <p className="text-sm text-white">
                      {new Date(rental.startDate).toLocaleDateString()} –{" "}
                      {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell className="text-[#d4d4d8]">{rental.quantity}</TableCell>

                  {/* Booking Amount */}
                  <TableCell className="font-medium text-white">
                    ৳{rental.totalAmount.toLocaleString()}
                  </TableCell>

                  {/* Payment Status */}
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${paymentBadge(rental.paymentStatus)}`}
                    >
                      {rental.paymentStatus}
                    </span>
                  </TableCell>

                  {/* Booking Status */}
                  <TableCell className="px-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${bookingBadge(rental.status)}`}
                    >
                      {rental.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}