"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const role = session?.user?.role ?? "customer";

  // Guests are sent to the login page.
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    // Role guard: only allow access to /dashboard/{role}
    if (pathname.startsWith("/dashboard/") && !pathname.startsWith(`/dashboard/${role}`)) {
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, session, pathname, role, router]);

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

  // Don't render children until the role check passes
  if (pathname.startsWith("/dashboard/") && !pathname.startsWith(`/dashboard/${role}`)) {
    return null;
  }

  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)] bg-[#09090b] text-white">
      <DashboardSidebar user={session.user} />

      <SidebarInset className="min-w-0 bg-[#09090b]">
        <header className="sticky top-16 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-[#09090b]/80 px-4 backdrop-blur">
          <SidebarTrigger className="text-[#a1a1aa] hover:bg-white/5 hover:text-white" />
          <span className="text-sm font-medium text-white">Dashboard</span>
          <span className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs capitalize text-[#a1a1aa]">
            {session.user.role ?? "customer"}
          </span>
        </header>

        <div className="min-w-0 flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
