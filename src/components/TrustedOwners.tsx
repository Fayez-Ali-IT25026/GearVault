"use client";

import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Star } from "lucide-react";

const owners = [
  {
    name: "Karim Heavy Machinery",
    location: "Dhaka",
    listings: 42,
    rating: 4.9,
  },
  {
    name: "Lens & Light Studio",
    location: "Chattogram",
    listings: 28,
    rating: 4.8,
  },
  {
    name: "Rafi Auto Rentals",
    location: "Sylhet",
    listings: 35,
    rating: 4.7,
  },
  {
    name: "Green Farm Tools",
    location: "Tangail",
    listings: 19,
    rating: 4.9,
  },
];

const TrustedOwners = () => {
  return (
    <section className="bg-[#09090b] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">Trusted Equipment Owners</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            Meet some of the verified owners who list their equipment on GearVault.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {owners.map((owner, index) => (
            <motion.div
              key={owner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              {/* avatar with first letter */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3b82f6]/15 text-2xl font-bold text-[#3b82f6]">
                {owner.name.charAt(0)}
              </div>

              <h3 className="mt-4 flex items-center justify-center gap-1 text-lg font-semibold text-white">
                {owner.name}
                <BadgeCheck className="h-4 w-4 text-[#3b82f6]" />
              </h3>

              <p className="mt-2 flex items-center justify-center gap-1 text-sm text-[#a1a1aa]">
                <MapPin className="h-4 w-4" /> {owner.location}
              </p>

              <div className="mt-5 flex items-center justify-center gap-6 border-t border-white/10 pt-4">
                <div>
                  <p className="font-bold text-white">{owner.listings}</p>
                  <p className="text-xs text-[#a1a1aa]">Listings</p>
                </div>
                <div>
                  <p className="flex items-center justify-center gap-1 font-bold text-white">
                    <Star className="h-4 w-4 fill-[#eab308] text-[#eab308]" />
                    {owner.rating}
                  </p>
                  <p className="text-xs text-[#a1a1aa]">Rating</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedOwners;