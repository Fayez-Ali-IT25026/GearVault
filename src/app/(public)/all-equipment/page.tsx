"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Package,
  PackageSearch,
  Search,
  X,
} from "lucide-react";
import type { Equipment, RentalType } from "@/Types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// The first 6 are the options in the "Add Equipment" form.
// The rest are categories that equipment in the database already uses.
const categories: string[] = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
  "Camera",
  "Camera Accessories",
  "Camera Lens",
  "Drone",
  "Laptop",
  "Monitor",
  "Projector",
  "Audio Equipment",
  "Lighting",
  "Speaker",
  "Tablet",
];

const conditions: string[] = ["New", "Like New", "Excellent", "Good", "Fair"];
const rentalTypes: RentalType[] = ["Daily", "Weekly", "Monthly"];

// Common locations, shown as suggestions while typing.
const locationSuggestions = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

/** All filter values in one object so the code stays short. */
type Filters = {
  category: string;
  condition: string;
  rentalType: string;
  location: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
};

const emptyFilters: Filters = {
  category: "",
  condition: "",
  rentalType: "",
  location: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
};

const inputClass =
  "w-full rounded-[12px] border border-white/10 bg-[#0c0d12] px-3 py-2.5 text-sm text-white placeholder:text-[#52525b] outline-none transition-colors focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20";

/** Colours for the status badge on a card. */
function statusClass(status: string) {
  if (status === "Approved" || status === "Available") {
    return "border-emerald-500/20 bg-emerald-500/15 text-emerald-300";
  }
  return "border-amber-500/20 bg-amber-500/15 text-amber-300";
}

/** One equipment card. */
function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.18)]">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0d12]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="size-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#3f3f46]">
            <Package className="size-10" />
          </div>
        )}

        <span
          className={`absolute top-3 left-3 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}
        >
          {item.status}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs text-[#71717a]">{item.category}</span>

        <h3 className="mt-1 text-lg font-semibold text-white">{item.name}</h3>

        <p className="mt-2 flex items-center gap-1 text-sm text-[#a1a1aa]">
          <MapPin className="size-4" />
          {item.location}
        </p>

        <p className="mt-1 text-xs text-[#52525b]">
          {item.condition} condition • {item.quantity} available
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-xl font-bold text-[#3b82f6]">
            ৳{item.rentPrice.toLocaleString()}
            <span className="text-sm font-normal text-[#a1a1aa]">
              {" "}
              / {item.rentalType}
            </span>
          </p>

          <Link
            href={`/equipment/${item._id}`}
            className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white transition-colors hover:bg-[#2563eb]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AllEquipmentPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Any filter or search change loads the list again.
  // The small timeout means we wait until the user stops typing.
  useEffect(() => {
    if (!API_BASE_URL) return;

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        if (filters.condition) params.set("condition", filters.condition);
        if (filters.rentalType) params.set("rentalType", filters.rentalType);
        if (filters.location) params.set("location", filters.location);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (search) params.set("search", search);

        // Sort order
        if (sort) params.set("sort", sort);

        // Only approved equipment is shown on the public page.
        params.set("status", "Approved");

        // Only items that are in stock.
        if (filters.availability === "in_stock") params.set("available", "true");

        const response = await fetch(
          `${API_BASE_URL}/equipment?${params.toString()}`
        );
        if (!response.ok) throw new Error();

        const data: Equipment[] = await response.json();
        setItems(data);
        setError("");
      } catch {
        setError("Could not load equipment. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [filters, search, sort, reloadKey]);

  function updateFilter(name: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setSearch("");
  }

  return (
    <section className="min-h-screen bg-[#09090b] py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">All Equipment</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            Browse equipment from owners across Bangladesh and find what you
            need.
          </p>
        </div>

        {/* Search + filters */}
        <div className="rounded-[16px] border border-white/10 bg-[#0f1016] p-4 sm:p-5">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#71717a]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, brand, model or location..."
              aria-label="Search equipment"
              className={`${inputClass} pr-10 pl-10`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#71717a] transition-colors hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Filter controls */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
              aria-label="Filter by category"
              className={inputClass}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.condition}
              onChange={(event) => updateFilter("condition", event.target.value)}
              aria-label="Filter by condition"
              className={inputClass}
            >
              <option value="">Any condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>

            <select
              value={filters.rentalType}
              onChange={(event) =>
                updateFilter("rentalType", event.target.value)
              }
              aria-label="Filter by rental type"
              className={inputClass}
            >
              <option value="">Any rental type</option>
              {rentalTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              list="locations"
              placeholder="Location (e.g. Dhaka)"
              aria-label="Filter by location"
              className={inputClass}
            />
            <datalist id="locations">
              {locationSuggestions.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>

            <input
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              type="number"
              min="0"
              placeholder="Min price (৳)"
              aria-label="Minimum price"
              className={inputClass}
            />

            <input
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              type="number"
              min="0"
              placeholder="Max price (৳)"
              aria-label="Maximum price"
              className={inputClass}
            />

            <select
              value={filters.availability}
              onChange={(event) =>
                updateFilter("availability", event.target.value)
              }
              aria-label="Filter by availability"
              className={inputClass}
            >
              <option value="">All availability</option>
              <option value="in_stock">In stock</option>
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort by"
              className={inputClass}
            >
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-[12px] border border-white/10 px-4 py-2.5 text-sm font-medium text-[#d4d4d8] transition-colors hover:bg-white/5 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Result count */}
        <p className="mt-8 text-sm text-[#a1a1aa]">
          {loading
            ? "Loading equipment…"
            : `${items.length} item${items.length === 1 ? "" : "s"} found`}
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 flex flex-col gap-3 rounded-[14px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
            {error}
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="w-fit rounded-[10px] border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && items.length === 0 && (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <div
                key={number}
                className="h-80 animate-pulse rounded-[16px] border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && items.length === 0 && (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-[16px] border border-white/10 bg-[#0f1016] px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-[#71717a]">
              <PackageSearch className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">No equipment found</p>
              <p className="mt-1 text-sm text-[#71717a]">
                Try another keyword or clear some filters.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-1 rounded-[10px] bg-[#3b82f6] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Cards */}
        {items.length > 0 && (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
