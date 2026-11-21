export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#3b82f6]" />
        <p className="text-sm text-[#a1a1aa]">Loading…</p>
      </div>
    </div>
  );
}