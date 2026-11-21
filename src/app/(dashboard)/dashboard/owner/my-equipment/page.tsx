"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ImageOff,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  Equipment,
  EquipmentCategory,
  EquipmentCondition,
  EquipmentEditValues,
  RentalType,
} from "@/Types";
import { authFetch } from "@/lib/api/authFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const categories: EquipmentCategory[] = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const conditions: EquipmentCondition[] = ["New", "Like New", "Good", "Fair"];
const rentalTypes: RentalType[] = ["Daily", "Weekly", "Monthly"];

const inputClass =
  "w-full rounded-[10px] border border-white/10 bg-[#0c0d12] px-3 py-2.5 text-sm text-white placeholder:text-[#52525b] outline-none transition-colors focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20";

/** A small label + input wrapper used inside the edit dialog. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">
        {label}
      </span>
      {children}
    </label>
  );
}

/** Colours for the status pill. */
function statusClass(status: string) {
  if (status === "Approved") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }
  if (status === "Rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

export default function MyEquipmentPage() {
  const { data: session } = authClient.useSession();
  const ownerId = session?.user.id;

  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The equipment being edited + the values inside the edit dialog.
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [editForm, setEditForm] = useState<EquipmentEditValues | null>(null);
  const [saving, setSaving] = useState(false);

  // The equipment waiting to be deleted.
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  // The Retry button increases this number to load the list again.
  const [reloadKey, setReloadKey] = useState(0);

  // Ask the backend for only this owner's equipment.
  useEffect(() => {
    if (!ownerId || !API_BASE_URL) return;

    async function loadEquipment() {
      try {
        const response = await authFetch(
          `${API_BASE_URL}/equipment?ownerId=${ownerId}&status=Approved,Pending,Rejected`
        );
        if (!response.ok) throw new Error();

        const data: Equipment[] = await response.json();
        setItems(data);
        setError("");
      } catch {
        setError("Could not load your equipment. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    loadEquipment();
  }, [ownerId, reloadKey]);

  // ---- Update ----

  function openEdit(item: Equipment) {
    setEditing(item);
    setEditForm({
      name: item.name,
      description: item.description,
      category: item.category,
      brand: item.brand,
      model: item.model,
      condition: item.condition,
      rentPrice: String(item.rentPrice),
      rentalType: item.rentalType,
      quantity: String(item.quantity),
      location: item.location,
      terms: item.terms,
    });
  }

  function handleEditChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setEditForm((current) => (current ? { ...current, [name]: value } : current));
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || !editForm) return;

    // The backend stores numbers, so convert the text inputs here.
    const updates = {
      ...editForm,
      rentPrice: Number(editForm.rentPrice),
      quantity: Number(editForm.quantity),
    };
    const editingId = editing._id;

    setSaving(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/equipment/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error();

      // Update the table without reloading the page.
      setItems((current) =>
        current.map((item) =>
          item._id === editingId ? { ...item, ...updates } : item
        )
      );

      toast.success("Equipment updated", "Your changes were saved.");
      setEditing(null);
    } catch {
      toast.error("Update failed", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ---- Delete ----

  async function confirmDelete() {
    if (!deleteTarget) return;

    const deleted = deleteTarget;
    setDeleting(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/equipment/${deleted._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();

      setItems((current) => current.filter((item) => item._id !== deleted._id));
      toast.success("Equipment deleted", `${deleted.name} was removed.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed", "Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const approved = items.filter((item) => item.status === "Approved").length;
  const pending = items.filter((item) => item.status === "Pending").length;
  const rejected = items.filter((item) => item.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Equipment
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Everything you have listed for rent.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="flex w-fit items-center gap-2 rounded-[12px] bg-[#3b82f6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
        >
          <Plus className="size-4" />
          Add Equipment
        </Link>
      </div>

      {/* Small summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total", value: items.length, color: "text-white" },
          { label: "Approved", value: approved, color: "text-emerald-300" },
          { label: "Pending", value: pending, color: "text-amber-300" },
          { label: "Rejected", value: rejected, color: "text-red-300" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] border border-white/10 bg-[#0f1016] p-4"
          >
            <p className="text-xs text-[#71717a]">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {loading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-[14px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setReloadKey((key) => key + 1);
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
            Loading your equipment…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-[#71717a]">
              <ImageOff className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">No equipment yet</p>
              <p className="mt-1 text-sm text-[#71717a]">
                Add your first item and it will show up here.
              </p>
            </div>
            <Link
              href="/dashboard/owner/add-equipment"
              className="mt-1 flex items-center gap-2 rounded-[10px] bg-[#3b82f6] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
            >
              <Plus className="size-4" />
              Add Equipment
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
                <TableHead className="hidden text-xs text-[#71717a] uppercase xl:table-cell">
                  Condition
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Price
                </TableHead>
                <TableHead className="text-xs text-[#71717a] uppercase">
                  Qty
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
              {items.map((item) => (
                <TableRow
                  key={item._id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  {/* Image + name */}
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
                          {[item.brand, item.model].filter(Boolean).join(" • ") ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden text-[#d4d4d8] xl:table-cell">
                    {item.category}
                  </TableCell>
                  <TableCell className="hidden text-[#d4d4d8] xl:table-cell">
                    {item.condition}
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-white">
                      ৳{item.rentPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#71717a]">{item.rentalType}</p>
                  </TableCell>

                  <TableCell className="text-[#d4d4d8]">{item.quantity}</TableCell>
                  <TableCell className="text-[#d4d4d8]">{item.location}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        title="Edit"
                        className="flex items-center gap-1.5 rounded-[10px] border border-white/10 px-2.5 py-1.5 text-xs font-medium text-[#d4d4d8] transition-colors hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/10 hover:text-white"
                      >
                        <Pencil className="size-3.5" />
                        <span className="hidden xl:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        title="Delete"
                        className="flex items-center gap-1.5 rounded-[10px] border border-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="hidden xl:inline">Delete</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-white/10 bg-[#0f1016] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg text-white">
              Edit equipment
            </DialogTitle>
            <DialogDescription className="text-[#a1a1aa]">
              Update the details below and save your changes.
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <form onSubmit={saveEdit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Equipment name">
                  <input
                    name="name"
                    required
                    value={editForm.name}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Category">
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Condition">
                <select
                  name="condition"
                  value={editForm.condition}
                  onChange={handleEditChange}
                  className={inputClass}
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Brand">
                <input
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Model">
                <input
                  name="model"
                  value={editForm.model}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Rental price (BDT)">
                <input
                  name="rentPrice"
                  type="number"
                  min="1"
                  required
                  value={editForm.rentPrice}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Rental type">
                <select
                  name="rentalType"
                  value={editForm.rentalType}
                  onChange={handleEditChange}
                  className={inputClass}
                >
                  {rentalTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Available quantity">
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Location">
                <input
                  name="location"
                  required
                  value={editForm.location}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea
                    name="description"
                    rows={3}
                    value={editForm.description}
                    onChange={handleEditChange}
                    className={`${inputClass} resize-y`}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Rental terms and conditions">
                  <textarea
                    name="terms"
                    rows={3}
                    value={editForm.terms}
                    onChange={handleEditChange}
                    className={`${inputClass} resize-y`}
                  />
                </Field>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-[10px] border border-white/10 px-4 py-2.5 text-sm font-medium text-[#d4d4d8] transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-[10px] bg-[#3b82f6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="border border-white/10 bg-[#0f1016] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete this equipment?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#a1a1aa]">
              {deleteTarget?.name} will be removed permanently. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-white/10 bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-[10px] border border-white/10 px-4 py-2 text-sm font-medium text-[#d4d4d8] transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
