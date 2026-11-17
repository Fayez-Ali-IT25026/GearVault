"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";
const Hero = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/equipment?search=${search}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#09090b]">
      {/* blue glow */}
      <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-[#3b82f6]/25 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#6366f1]/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {/* left side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-[#a1a1aa]">
            Trusted equipment rental marketplace
          </p>

          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Rent the gear.{" "}
            <span className="text-[#3b82f6]">Skip the cost.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-[#a1a1aa]">
            Rent verified equipment from trusted owners near you. Flexible rental
            periods and secure payments.
          </p>

          {/* search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2"
          >
            <Search className="ml-2 h-5 w-5 text-[#a1a1aa]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search equipment..."
              className="w-full bg-transparent py-2 text-white placeholder:text-[#71717a] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#3b82f6] px-5 py-2 text-white hover:bg-[#2563eb]"
            >
              Search
            </button>
          </form>

          {/* buttons */}
          <div className="mt-6 flex gap-4">
            <Link
              href="/equipment"
              className="flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 text-white hover:bg-[#2563eb]"
            >
              Browse Equipment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-white/10 px-6 py-3 text-white hover:bg-white/5"
            >
              List Equipment
            </Link>
          </div>

          {/* stats */}
          <div className="mt-10 flex gap-10 border-t border-white/10 pt-6">
            <div>
              <p className="text-2xl font-bold text-white">2,500+</p>
              <p className="text-sm text-[#a1a1aa]">Equipment</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">800+</p>
              <p className="text-sm text-[#a1a1aa]">Owners</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9</p>
              <p className="text-sm text-[#a1a1aa]">Rating</p>
            </div>
          </div>
        </motion.div>

        {/* right side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80"
            alt="Construction equipment"
            className="h-[450px] w-full rounded-3xl border border-white/10 object-cover shadow-[0_0_60px_rgba(59,130,246,0.25)]"
            width={900}
            height={450}
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -left-4 top-10 rounded-xl border border-white/10 bg-[#111113]/90 p-3 backdrop-blur"
          >
            <p className="text-sm font-semibold text-white">Verified owners</p>
            <p className="text-xs text-[#a1a1aa]">Every listing approved</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-4 right-6 rounded-xl border border-white/10 bg-[#111113]/90 p-3 backdrop-blur"
          >
            <p className="text-sm font-semibold text-white">Secure payments</p>
            <p className="text-xs text-[#a1a1aa]">Powered by Stripe</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;