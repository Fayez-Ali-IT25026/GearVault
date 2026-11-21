"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <AlertTriangle className="size-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-md text-[#a1a1aa]">
        An unexpected error occurred. You can try again or go back to the home page.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-[#52525b]">Error ID: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}