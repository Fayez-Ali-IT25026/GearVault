"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  ClipboardList,
  FileText,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Upload,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { authFetch } from "@/lib/api/authFetch";
import type {
  EquipmentCategory,
  EquipmentFormValues,
  EquipmentPayload,
} from "@/Types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const categories: EquipmentCategory[] = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const inputClass =
  "w-full rounded-[12px] border border-white/10 bg-[#0c0d12] px-4 py-3 text-sm text-white placeholder:text-[#52525b] outline-none transition-colors focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-white/10 bg-[#0f1016] p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#3b82f6]/15 text-[#3b82f6]">
          <Icon className="size-[18px]" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-0.5 text-xs text-[#71717a]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#d4d4d8]">
        {label}{" "}
        {required && (
          <span aria-hidden="true" className="text-[#3b82f6]">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export default function AddEquipmentPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<EquipmentFormValues>({
    name: "",
    description: "",
    category: "",
    brand: "",
    model: "",
    condition: "Good",
    rentPrice: "",
    rentalType: "Daily",
    quantity: "1",
    location: "",
    image: "",
    terms: "",
  });

  // Every input has a name that matches a key in `form`.
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", "Please choose an image under 5 MB.");
      event.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("Missing API key", "Add NEXT_PUBLIC_IMGBB_API_KEY to .env");
      event.target.value = "";
      return;
    }

    // Upload to imgbb and save the URL instead of base64.
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Upload failed");

      setForm((current) => ({ ...current, image: data.data.url }));
      toast.success("Image uploaded", "Your image is ready.");
    } catch (err) {
      toast.error("Upload failed", err instanceof Error ? err.message : "Try again.");
      event.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setForm((current) => ({ ...current, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      toast.error("Not signed in", "Please sign in again.");
      return;
    }

    if (!API_BASE_URL) {
      toast.error("Backend URL missing", "Set NEXT_PUBLIC_API_BASE_URL in .env.");
      return;
    }

    // The backend stores this object in the add-Equipment collection.
    const payload: EquipmentPayload = {
      ...form,
      rentPrice: Number(form.rentPrice),
      quantity: Number(form.quantity),
      status: "Pending",
      // session.user.id is the user's MongoDB _id.
      ownerId: session.user.id,
      ownerName: session.user.name,
      ownerEmail: session.user.email,
    };

    setIsSubmitting(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Please try again.");
      }

      toast.success("Equipment submitted", "Your listing is pending admin approval.");
      router.push("/dashboard/owner");
      router.refresh();
    } catch (error) {
      toast.error(
        "Could not add equipment",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Add Equipment
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Fill in the details below to list your equipment for rent.
          </p>
        </div>
        <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
          Pending approval
        </span>
      </div>

      {/* 1. Basic Information */}
      <Section
        icon={Package}
        title="Basic Information"
        description="Tell customers what your equipment is."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Equipment Name" htmlFor="name" required>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Caterpillar Mini Excavator"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Description" htmlFor="description" required>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the equipment, what it includes and what it is best used for."
                className={`${inputClass} min-h-28 resize-y`}
              />
            </Field>
          </div>

          <Field label="Category" htmlFor="category" required>
            <select
              id="category"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Brand" htmlFor="brand">
            <input
              id="brand"
              name="brand"
              type="text"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Caterpillar"
              className={inputClass}
            />
          </Field>

          <Field label="Model" htmlFor="model">
            <input
              id="model"
              name="model"
              type="text"
              value={form.model}
              onChange={handleChange}
              placeholder="e.g. 301.7 CR"
              className={inputClass}
            />
          </Field>

          <Field label="Equipment Condition" htmlFor="condition" required>
            <select
              id="condition"
              name="condition"
              required
              value={form.condition}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* 2. Rental Information */}
      <Section
        icon={Banknote}
        title="Rental Information"
        description="Set your price, availability and pickup location."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rental Price (BDT)" htmlFor="rentPrice" required>
            <input
              id="rentPrice"
              name="rentPrice"
              type="number"
              required
              min="1"
              step="any"
              value={form.rentPrice}
              onChange={handleChange}
              placeholder="e.g. 1500"
              className={inputClass}
            />
          </Field>

          <Field label="Rental Type" htmlFor="rentalType" required>
            <select
              id="rentalType"
              name="rentalType"
              required
              value={form.rentalType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </Field>

          <Field label="Available Quantity" htmlFor="quantity" required>
            <input
              id="quantity"
              name="quantity"
              type="number"
              required
              min="1"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 2"
              className={inputClass}
            />
          </Field>

          <Field label="Location" htmlFor="location" required>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Dhaka"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* 3. Equipment Image */}
      <Section
        icon={ImagePlus}
        title="Equipment Image"
        description="Upload a clear photo so customers know what they are renting."
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex h-44 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-white/15 bg-[#0c0d12] text-center transition-colors hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Upload className="size-6 text-[#3b82f6]" />
            <span className="text-sm font-medium text-white">Click to upload</span>
            <span className="text-xs text-[#71717a]">PNG or JPG, up to 5 MB</span>
          </label>

          {uploadingImage ? (
            <div className="flex h-44 flex-1 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.02]">
              <Loader2 className="size-6 animate-spin text-[#3b82f6]" />
              <span className="ml-2 text-sm text-[#71717a]">Uploading…</span>
            </div>
          ) : form.image ? (
            <div className="relative h-44 flex-1 overflow-hidden rounded-[12px] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt="Equipment preview"
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove image"
                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex h-44 flex-1 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.02] text-sm text-[#52525b]">
              Image preview
            </div>
          )}
        </div>
      </Section>

      {/* 4. Additional Information */}
      <Section
        icon={FileText}
        title="Additional Information"
        description="Add your rental rules and review the owner details."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Rental Terms and Conditions" htmlFor="terms">
              <textarea
                id="terms"
                name="terms"
                rows={4}
                value={form.terms}
                onChange={handleChange}
                placeholder="e.g. A security deposit is required. Equipment must be returned in the same condition."
                className={`${inputClass} min-h-28 resize-y`}
              />
            </Field>
          </div>

          {/* Status is set by the server action */}
          <div className="flex items-center gap-3 rounded-[12px] border border-amber-500/20 bg-amber-500/[0.06] p-4 sm:col-span-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-amber-500/15 text-amber-400">
              <ClipboardList className="size-[18px]" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Status: Pending</p>
              <p className="text-xs text-[#a1a1aa]">
                New listings are reviewed by an admin before they go live.
              </p>
            </div>
          </div>

          {/* Owner comes from the logged-in session */}
          <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-4 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-[#71717a] uppercase">
              <UserRound className="size-4" />
              Owner information
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#71717a]">Name</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {session?.user.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#71717a]">Email</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {session?.user.email ?? "—"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#52525b]">
              Automatically taken from your account — no need to fill this in.
            </p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/dashboard/owner")}
          className="rounded-[12px] border border-white/10 px-5 py-3 text-sm font-medium text-[#d4d4d8] transition-colors hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="flex items-center justify-center gap-2 rounded-[12px] bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Submit Equipment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
