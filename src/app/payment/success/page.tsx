"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Home,
  Loader2,
  X,
} from "lucide-react";
import { confirmPayment } from "@/lib/actions/booking";

type Status = "loading" | "done" | "error";

const tone = {
  loading: "border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]",
  done: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
  error: "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]",
};

/** The card shown for every state (loading, success, error). */
function StatusCard({
  status,
  title,
  text,
  reference,
  children,
}: {
  status: Status;
  title: string;
  text: string;
  reference?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 py-28">
      {/* background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/15 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_0_60px_rgba(59,130,246,0.12)] backdrop-blur"
      >
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border ${tone[status]}`}
        >
          {status === "loading" && <Loader2 className="h-9 w-9 animate-spin" />}
          {status === "done" && <Check className="h-9 w-9" strokeWidth={3} />}
          {status === "error" && <X className="h-9 w-9" strokeWidth={3} />}
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{text}</p>

        {reference && (
          <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#a1a1aa]">
            Reference:{" "}
            <span className="font-mono font-semibold text-white">{reference}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {children}
        </div>
      </motion.div>
    </section>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<Status>(sessionId ? "loading" : "error");
  const [message, setMessage] = useState(
    sessionId ? "" : "No payment session was found in the link."
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    confirmPayment(sessionId)
      .then(() => {
        if (!cancelled) setStatus("done");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Something went wrong.");
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const buttons = (
    <>
      <Link
        href="/all-equipment"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3b82f6] py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
      >
        Browse equipment <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        href="/"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <Home className="h-4 w-4" /> Home
      </Link>
    </>
  );

  if (status === "loading") {
    return (
      <StatusCard
        status="loading"
        title="Confirming your payment…"
        text="Please wait a moment. Do not close this page."
      >
        {null}
      </StatusCard>
    );
  }

  if (status === "error") {
    return (
      <StatusCard
        status="error"
        title="Payment not confirmed"
        text={message || "We could not confirm this payment."}
      >
        {buttons}
      </StatusCard>
    );
  }

  return (
    <StatusCard
      status="done"
      title="Payment successful"
      text="Your booking is confirmed. The owner will contact you soon."
      reference={sessionId ? sessionId.slice(-10).toUpperCase() : undefined}
    >
      {buttons}
    </StatusCard>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <StatusCard
          status="loading"
          title="Checking payment…"
          text="Please wait a moment."
        >
          {null}
        </StatusCard>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
