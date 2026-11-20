"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, PackageSearch } from "lucide-react";
import type { Equipment } from "@/Types";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const FeaturedEquipment = () => {
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/equipment?status=Approved,Available&sort=newest&limit=6`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load");
        const data: Equipment[] = await res.json();
        // safety net: works even if the server ignores sort/limit
        const list = data
          .filter((e) => e.status === "Approved" || e.status === "Available")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6);
        setItems(list);
      } catch (err) {
        console.error("Featured equipment error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="bg-[#09090b] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">Featured Equipment</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            Hand-picked equipment from verified owners, ready to rent today.
          </p>
        </div>

        {/* loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* empty state */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <PackageSearch className="h-12 w-12 text-[#3b82f6]" />
            <p className="text-[#a1a1aa]">No equipment available right now.</p>
          </div>
        )}

        {/* cards */}
        {!loading && items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const available = item.quantity > 0;
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                >
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-[#a1a1aa]">{item.category}</span>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                          available
                            ? "bg-[#22c55e]/15 text-[#22c55e]"
                            : "bg-[#ef4444]/15 text-[#ef4444]"
                        }`}
                      >
                        {available ? "Available" : "Booked"}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-white">
                      {item.name}
                    </h3>

                    <p className="mt-2 flex items-center gap-1 text-sm text-[#a1a1aa]">
                      <MapPin className="h-4 w-4" /> {item.location}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <p className="text-xl font-bold text-[#3b82f6]">
                        ${item.rentPrice}
                        <span className="text-sm font-normal text-[#a1a1aa]">
                          {" "}
                          / {item.rentalType}
                        </span>
                      </p>
                      <Link
                        href={session?.user ? `/equipment/${item._id}` : "/login"}
                        className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white hover:bg-[#2563eb]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEquipment;