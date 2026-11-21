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
import { Loader2, Check, X, Package } from "lucide-react";
import type { Equipment } from "@/Types";
import { authFetch } from "@/lib/api/authFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminEquipmentPage() {
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load all equipment from the backend
  useEffect(() => {
    async function loadEquipment() {
      try {
        const response = await authFetch(`${API_BASE_URL}/equipment`);
        if (!response.ok) throw new Error();
        const data: Equipment[] = await response.json();
        setEquipment(data);
        setError("");
      } catch {
        setError("Could not load equipment. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadEquipment();
  }, []);

  // Approve or reject an equipment
  async function updateStatus(equipmentId: string, status: "Approved" | "Rejected") {
    setUpdatingId(equipmentId);
    try {
      const response = await authFetch(`${API_BASE_URL}/equipment/${equipmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();

      // Update the local list without reloading
      setEquipment((current) =>
        current.map((item) =>
          item._id === equipmentId ? { ...item, status } : item
        )
      );
      toast.success(
        status === "Approved" ? "Approved" : "Rejected",
        `Equipment has been ${status.toLowerCase()}.`
      );
    } catch {
      toast.error("Failed", "Could not update status. Try again.");
    } finally {
      setUpdatingId(null);
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
            Equipment
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            All equipment listings. Approve or reject pending items.
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
            Loading equipment…
          </div>
        ) : equipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-[#71717a]">
              <Package className="size-5" />
            </span>
            <p className="font-medium text-white">No equipment yet</p>
            <p className="mt-1 text-sm text-[#71717a]">
              Equipment listings will appear here.
            </p>
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
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Price
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Qty
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Location
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Status
                </TableHead>
                <TableHead className="px-3 text-right text-xs text-[#71717a] uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {equipment.map((item) => (
                <TableRow
                  key={item._id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  {/* Image + name */}
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-11 shrink-0 rounded-[10px] border border-white/10 object-cover"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] text-[#52525b]">
                          <Package className="size-5" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {item.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#71717a]">
                          {[item.brand, item.model].filter(Boolean).join(" • ") ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden text-[#d4d4d8] xl:table-cell">
                    {item.category}
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-white">
                      ৳{item.rentPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#71717a]">{item.rentalType}</p>
                  </TableCell>

                  <TableCell className="text-[#d4d4d8]">{item.quantity}</TableCell>
                  <TableCell className="text-[#d4d4d8]">{item.location}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(item._id, "Approved")}
                        disabled={updatingId === item._id}
                        title="Approve"
                        className="flex items-center gap-1.5 rounded-[10px] border border-green-500/20 px-2.5 py-1.5 text-xs font-medium text-green-300 transition-colors hover:bg-green-500/10 disabled:opacity-50"
                      >
                        {updatingId === item._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                        <span className="hidden xl:inline">Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(item._id, "Rejected")}
                        disabled={updatingId === item._id}
                        title="Reject"
                        className="flex items-center gap-1.5 rounded-[10px] border border-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {updatingId === item._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                        <span className="hidden xl:inline">Reject</span>
                      </button>
                    </div>
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

/** Colours for the status pill. */
function statusClass(status: string) {
  if (status === "Approved") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }
  if (status === "Rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }
  if (status === "Available") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  }
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}