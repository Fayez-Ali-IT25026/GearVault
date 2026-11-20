"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Loader2, Heart, Trash2, Package, MapPin } from "lucide-react";
import type { Equipment } from "@/Types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FavoritesPage() {
  const { data: session, isPending } = authClient.useSession();

  const [favorites, setFavorites] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Load favorites from backend
  useEffect(() => {
    if (!session?.user?.email) return;

    async function loadFavorites() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/favorites?email=${session.user.email}`
        );
        if (!res.ok) throw new Error();
        const data: Equipment[] = await res.json();
        setFavorites(data);
        setError("");
      } catch {
        setError("Could not load favorites. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [session?.user?.email]);

  // Remove a favorite
  async function removeFavorite(equipmentId: string) {
    if (!session?.user?.email) return;
    setRemovingId(equipmentId);
    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId,
          userEmail: session.user.email,
        }),
      });
      if (!res.ok) throw new Error();
      setFavorites((current) => current.filter((f) => f._id !== equipmentId));
      toast.success("Removed", "Equipment removed from favorites.");
    } catch {
      toast.error("Failed", "Could not remove favorite. Try again.");
    } finally {
      setRemovingId(null);
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
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Equipment you have saved for later.
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
            Loading favorites…
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-[#71717a]">
              <Heart className="size-5" />
            </span>
            <p className="font-medium text-white">No favorites yet</p>
            <p className="mt-1 text-sm text-[#71717a]">
              Browse equipment and tap the heart icon to save your favorites.
            </p>
            <Link
              href="/all-equipment"
              className="mt-1 flex items-center gap-2 rounded-[10px] bg-[#3b82f6] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
            >
              Browse equipment
            </Link>
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
              {favorites.map((item) => (
                <TableRow
                  key={item._id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
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
                          {[item.brand, item.model].filter(Boolean).join(" • ") || "—"}
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

                  <TableCell className="text-[#d4d4d8]">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#71717a]" />
                      {item.location}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                        item.status === "Approved" || item.status === "Available"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/equipment/${item._id}`}
                        className="flex items-center gap-1.5 rounded-[10px] border border-[#3b82f6]/40 px-2.5 py-1.5 text-xs font-medium text-[#3b82f6] transition-colors hover:bg-[#3b82f6]/10"
                      >
                        View & Book
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeFavorite(item._id)}
                        disabled={removingId === item._id}
                        title="Remove from favorites"
                        className="flex items-center gap-1.5 rounded-[10px] border border-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {removingId === item._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
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