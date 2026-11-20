import Link from "next/link";
import { ArrowLeft, Home, X } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 py-28">
      {/* background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ef4444]/10 blur-[140px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_0_60px_rgba(239,68,68,0.10)] backdrop-blur">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]">
          <X className="h-9 w-9" strokeWidth={3} />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">Payment cancelled</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">
          Your card was not charged. You can go back to the equipment page and
          try the booking again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/all-equipment"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3b82f6] py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
          >
            <ArrowLeft className="h-4 w-4" /> Try again
          </Link>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>
    </section>
  );
}
