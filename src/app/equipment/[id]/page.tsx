"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  MapPin,
  PackageSearch,
  ShieldCheck,
  Tag,
  User,
  Wrench,
} from "lucide-react";
import type { Equipment } from "@/Types";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DAY_MS = 1000 * 60 * 60 * 24;
// How many days one rental unit covers
const periodDays = { Daily: 1, Weekly: 7, Monthly: 30 } as const;

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-[#71717a] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30";

const EquipmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [item, setItem] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quantity: 1,
    phone: "",
    address: "",
    notes: "",
  });

  /* ---------- load equipment ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/equipment/${id}`);
        if (!res.ok) throw new Error("not found");
        setItem(await res.json());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ---------- total price calculation ---------- */
  const { days, total } = useMemo(() => {
    if (!item || !form.startDate || !form.endDate) return { days: 0, total: 0 };
    const diff =
      Math.ceil(
        (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
          DAY_MS
      ) + 1; // inclusive of both dates
    if (diff < 1) return { days: 0, total: 0 };
    const units = Math.ceil(diff / periodDays[item.rentalType]);
    return { days: diff, total: units * item.rentPrice * form.quantity };
  }, [item, form.startDate, form.endDate, form.quantity]);

  const today = new Date().toISOString().split("T")[0];
  const available = !!item && item.quantity > 0;

  /* ---------- favorites ---------- */
  const toggleFavorite = async () => {
    if (!session?.user || !item) return;
    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        method: isFav ? "DELETE" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          equipmentId: item._id,
          userEmail: session.user.email,
        }),
      });
      if (!res.ok) throw new Error();
      setIsFav(!isFav);
      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.error("Something went wrong", "Could not update favorites.");
    }
  };

  /* ---------- booking -> payment ---------- */
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !session?.user) return;

    if (days < 1) return toast.error("Invalid dates", "End date must be after start date.");
    if (form.quantity > item.quantity)
      return toast.error("Not enough stock", `Only ${item.quantity} available.`);

    setSubmitting(true);
    try {
      // Backend should check availability and return a Stripe Checkout URL
      const res = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          equipmentId: item._id,
          equipmentName: item.name,
          ownerEmail: item.ownerEmail,
          customerName: session.user.name,
          customerEmail: session.user.email,
          ...form,
          totalAmount: total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      window.location.href = data.url;
    } catch (err) {
      toast.error("Booking failed", err instanceof Error ? err.message : "Try again.");
      setSubmitting(false);
    }
  };

  /* ---------- loading / not found ---------- */
  if (loading)
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-28">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="aspect-[4/3] rounded-2xl bg-white/5 lg:col-span-3" />
          <div className="space-y-4 lg:col-span-2">
            <div className="h-8 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-1/2 rounded bg-white/5" />
            <div className="h-48 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );

  if (notFound || !item)
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <PackageSearch className="h-14 w-14 text-[#3b82f6]" />
        <h2 className="text-2xl font-bold text-white">Equipment not found</h2>
        <Link href="/all-equipment" className="rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm text-white hover:bg-[#2563eb]">
          Browse all equipment
        </Link>
      </div>
    );

  const specs = [
    { icon: Tag, label: "Brand", value: item.brand },
    { icon: Wrench, label: "Model", value: item.model },
    { icon: ShieldCheck, label: "Condition", value: item.condition },
    { icon: CalendarDays, label: "Rental type", value: item.rentalType },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090b] pb-20 pt-28">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#3b82f6]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#a1a1aa] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ---------------- LEFT ---------------- */}
          <div className="space-y-8 lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_60px_rgba(59,130,246,0.15)]"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/70 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                {item.category}
              </span>
            </motion.div>

            {/* specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-[#3b82f6]" />
                  <p className="mt-3 text-xs text-[#a1a1aa]">{label}</p>
                  <p className="mt-0.5 truncate font-semibold text-white">{value}</p>
                </div>
              ))}
            </motion.div>

            {/* description */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white">About this equipment</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-[#a1a1aa]">{item.description}</p>
            </div>

            {/* terms */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <ShieldCheck className="h-5 w-5 text-[#3b82f6]" /> Rental terms & conditions
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-[#a1a1aa]">{item.terms}</p>
            </div>
          </div>

          {/* ---------------- RIGHT (sticky) ---------------- */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5 lg:sticky lg:top-28"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{item.name}</h1>
                  <button
                    onClick={toggleFavorite}
                    aria-label="Toggle favorite"
                    className="rounded-full border border-white/10 bg-white/5 p-2.5 transition hover:border-[#ef4444]/50"
                  >
                    <Heart className={`h-5 w-5 ${isFav ? "fill-[#ef4444] text-[#ef4444]" : "text-white"}`} />
                  </button>
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-[#a1a1aa]">
                  <MapPin className="h-4 w-4" /> {item.location}
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-6">
                  <p className="text-4xl font-extrabold text-[#3b82f6]">
                    ৳{item.rentPrice}
                    <span className="ml-1 text-base font-normal text-[#a1a1aa]">/ {item.rentalType}</span>
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      available ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-[#ef4444]/15 text-[#ef4444]"
                    }`}
                  >
                    {available ? `${item.quantity} available` : "Out of stock"}
                  </span>
                </div>

                <button
                  disabled={!available}
                  onClick={() => setOpen(true)}
                  className="mt-6 w-full rounded-xl bg-[#3b82f6] py-3.5 font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  Book Now
                </button>
                <p className="mt-3 text-center text-xs text-[#71717a]">Secure payment with Stripe</p>
              </div>

              {/* owner */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">Listed by</h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6]/20 text-[#3b82f6]">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-semibold text-white">
                      {item.ownerName} <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                    </p>
                    <p className="flex items-center gap-1.5 truncate text-sm text-[#a1a1aa]">
                      <Mail className="h-3.5 w-3.5" /> {item.ownerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ---------------- BOOKING MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0f0f12] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Book {item.name}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5 text-sm text-[#a1a1aa]">
                Start date
                <input
                  type="date"
                  required
                  min={today}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="space-y-1.5 text-sm text-[#a1a1aa]">
                End date
                <input
                  type="date"
                  required
                  min={form.startDate || today}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={inputCls}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5 text-sm text-[#a1a1aa]">
                Quantity
                <input
                  type="number"
                  required
                  min={1}
                  max={item.quantity}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className={inputCls}
                />
              </label>
              <label className="space-y-1.5 text-sm text-[#a1a1aa]">
                Contact number
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                />
              </label>
            </div>

            <label className="block space-y-1.5 text-sm text-[#a1a1aa]">
              Delivery address
              <input
                required
                placeholder="House, road, area, city"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputCls}
              />
            </label>

            <label className="block space-y-1.5 text-sm text-[#a1a1aa]">
              Additional notes
              <textarea
                rows={3}
                placeholder="Anything the owner should know (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={inputCls}
              />
            </label>

            {/* summary */}
            <div className="rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/10 p-4 text-sm">
              <div className="flex justify-between text-[#a1a1aa]">
                <span>Duration</span>
                <span className="text-white">{days > 0 ? `${days} day(s)` : "—"}</span>
              </div>
              <div className="mt-2 flex justify-between text-[#a1a1aa]">
                <span>Rate × quantity</span>
                <span className="text-white">
                  ৳{item.rentPrice} / {item.rentalType} × {form.quantity}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
                <span>Total</span>
                <span className="text-[#3b82f6]">৳{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] py-3 font-semibold text-white transition hover:bg-[#2563eb] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Redirecting to payment..." : "Confirm & Pay"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EquipmentDetailsPage;