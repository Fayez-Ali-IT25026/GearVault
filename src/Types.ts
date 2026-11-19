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

/** Roles a new user can pick on the register page. */
export type SignupRole = "customer" | "owner";

/** Options for the equipment listing form. */
export type EquipmentCondition = "New" | "Like New" | "Good" | "Fair";
export type RentalType = "Daily" | "Weekly" | "Monthly";
export type EquipmentStatus = "Pending" | "Approved" | "Rejected" | "Available";

export type EquipmentCategory =
  | "Construction Equipment"
  | "Photography Equipment"
  | "Vehicles & Transportation"
  | "Agriculture Equipment"
  | "Electronics"
  | "Event Equipment";

/** Values collected by the Add Equipment form. */
export type EquipmentFormValues = {
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  condition: EquipmentCondition;
  rentPrice: string;
  rentalType: RentalType;
  quantity: string;
  location: string;
  image: string;
  terms: string;
};

/** The JSON body sent to the backend POST /equipment endpoint. */
export type EquipmentPayload = {
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  condition: EquipmentCondition;
  rentPrice: number;
  rentalType: RentalType;
  quantity: number;
  location: string;
  image: string;
  terms: string;
  status: EquipmentStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
};

/** Fields the owner can change from the My Equipment table (form values are text). */
export type EquipmentEditValues = {
  name: string;
  description: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  condition: EquipmentCondition;
  rentPrice: string;
  rentalType: RentalType;
  quantity: string;
  location: string;
  terms: string;
};

/** One equipment document returned by the backend. */
export type Equipment = {
  _id: string;
  name: string;
  description: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  condition: EquipmentCondition;
  rentPrice: number;
  rentalType: RentalType;
  quantity: number;
  location: string;
  image: string;
  terms: string;
  status: EquipmentStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
};
