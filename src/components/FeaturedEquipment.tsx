"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";

const equipment = [
  {
    _id: "1",
    name: "Caterpillar Mini Excavator",
    category: "Construction Equipment",
    price: 150,
    rentalType: "Daily",
    location: "Dhaka",
    available: true,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2",
    name: "Canon EOS R5 Camera Kit",
    category: "Photography Equipment",
    price: 60,
    rentalType: "Daily",
    location: "Chattogram",
    available: true,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3",
    name: "Toyota Hiace Van",
    category: "Vehicles & Transportation",
    price: 90,
    rentalType: "Daily",
    location: "Sylhet",
    available: false,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "4",
    name: "Kubota Tractor",
    category: "Agriculture Equipment",
    price: 400,
    rentalType: "Weekly",
    location: "Tangail",
    available: true,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5",
    name: "DJ Sound System Set",
    category: "Event Equipment",
    price: 120,
    rentalType: "Daily",
    location: "Dhaka",
    available: true,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6",
    name: "Gaming Laptop Pro",
    category: "Electronics",
    price: 900,
    rentalType: "Monthly",
    location: "Rajshahi",
    available: true,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  },
];

const FeaturedEquipment = () => {
  const user = null; // replace with your BetterAuth session

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

        {/* cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={250}
                className="aspect-[16/10] w-full object-cover"
              />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#a1a1aa]">{item.category}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.available
                        ? "bg-[#22c55e]/15 text-[#22c55e]"
                        : "bg-[#ef4444]/15 text-[#ef4444]"
                    }`}
                  >
                    {item.available ? "Available" : "Booked"}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-white">{item.name}</h3>

                <p className="mt-2 flex items-center gap-1 text-sm text-[#a1a1aa]">
                  <MapPin className="h-4 w-4" /> {item.location}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <p className="text-xl font-bold text-[#3b82f6]">
                    ${item.price}
                    <span className="text-sm font-normal text-[#a1a1aa]">
                      {" "}
                      / {item.rentalType}
                    </span>
                  </p>
                  <Link
                    href={user ? `/equipment/${item._id}` : "/login"}
                    className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white hover:bg-[#2563eb]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEquipment;