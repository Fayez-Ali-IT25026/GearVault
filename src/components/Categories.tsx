"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HardHat, Camera, Truck, Wheat, Laptop, PartyPopper } from "lucide-react";

const categories = [
  { name: "Construction Equipment", icon: HardHat, count: "450+ items" },
  { name: "Photography Equipment", icon: Camera, count: "320+ items" },
  { name: "Vehicles & Transportation", icon: Truck, count: "280+ items" },
  { name: "Agriculture Equipment", icon: Wheat, count: "210+ items" },
  { name: "Electronics", icon: Laptop, count: "390+ items" },
  { name: "Event Equipment", icon: PartyPopper, count: "260+ items" },
];

const Categories = () => {
  return (
    <section className="bg-[#09090b] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">Browse by Category</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            Find the right equipment for your project from our most popular categories.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="flex h-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <div className="rounded-lg bg-[#3b82f6]/15 p-4">
                  <cat.icon className="h-7 w-7 text-[#3b82f6]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                  <p className="text-sm text-[#a1a1aa]">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;