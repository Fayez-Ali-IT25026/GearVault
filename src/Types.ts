import type { LucideIcon } from "lucide-react";

/** Every account role supported by the app. */
export type UserRole = "customer" | "owner" | "admin";

/** Signed-in user shown in the dashboard sidebar. */
export type DashboardUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: UserRole | null;
};

/** A single link inside the dashboard navigation. */
export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
