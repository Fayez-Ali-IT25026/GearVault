"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  ClipboardList,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api/authFetch";
import { toast } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type { DashboardNavItem, DashboardUser, UserRole } from "@/Types";

// Every role only links to pages that already exist in its dashboard folder.
const navItems: Record<UserRole, DashboardNavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Rentals", href: "/dashboard/customer/my-rentals", icon: CalendarCheck },
    { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
  owner: [
    { label: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { label: "My Equipment", href: "/dashboard/owner/my-equipment", icon: Package },
    { label: "Add Equipment", href: "/dashboard/owner/add-equipment", icon: PlusCircle },
    { label: "Equipment Rentals", href: "/dashboard/owner/my-equipment-rentals", icon: ClipboardList },
    { label: "Profile", href: "/dashboard/owner/profile", icon: UserRound },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Equipment", href: "/dashboard/admin/equipment", icon: Wrench },
    { label: "Rentals", href: "/dashboard/admin/rentals", icon: ClipboardList },
    { label: "Profile", href: "/dashboard/admin/profile", icon: UserRound },
  ],
};

const roleLabel: Record<UserRole, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
};

// Unknown or missing roles fall back to the customer dashboard.
const getRole = (role?: string | null): UserRole =>
  role === "owner" || role === "admin" ? role : "customer";

export default function DashboardSidebar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const role = getRole(user.role);
  const links = navItems[role];
  const home = `/dashboard/${role}`;
  const initial = (user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase();

  const isActive = (href: string) =>
    pathname === href || (href !== home && pathname.startsWith(`${href}/`));

  // Close the mobile drawer after picking a link.
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleSignOut = async () => {
    clearToken();
    await authClient.signOut();
    toast.success("Signed out", "See you next time!");
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 !top-16 !h-[calc(100svh-4rem)]"
    >
      {/* Brand */}
      <SidebarHeader className="border-b border-white/10 p-2">
        <Link
          href="/login"
          onClick={closeOnMobile}
          className="flex h-10 items-center gap-3 rounded-[10px] px-1.5 transition-colors hover:bg-white/[0.04]"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#3b82f6]/15 text-[#3b82f6]">
            <ShieldCheck className="size-[18px]" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold tracking-tight text-white">
              Gear<span className="text-[#3b82f6]">Vault</span>
            </span>
            <span className="block truncate text-[11px] text-[#71717a]">
              {roleLabel[role]} dashboard
            </span>
          </span>
        </Link>
      </SidebarHeader>

      {/* Role based links */}
      <SidebarContent>
        <SidebarGroup className="py-3">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717a]">
            {roleLabel[role]} menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} onClick={closeOnMobile} />}
                      isActive={active}
                      tooltip={label}
                      className="h-10 rounded-[10px] px-3 text-[13.5px] font-medium text-[#a1a1aa] transition-colors"
                    >
                      <Icon className={active ? "text-[#3b82f6]" : "text-[#71717a]"} />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Signed-in user + sign out */}
      <SidebarFooter className="border-t border-white/10 p-2">
        <div className="mb-1 flex items-center gap-3 rounded-[10px] px-2 py-2 group-data-[collapsible=icon]:hidden">
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3b82f6] text-sm font-bold text-white">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="size-full object-cover" />
            ) : (
              initial
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-[#71717a]">{user.email}</p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={handleSignOut}
              className="h-10 rounded-[10px] px-3 text-[#f87171] hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
