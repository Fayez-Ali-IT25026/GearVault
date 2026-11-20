"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Handshake,
  Search,
  ShieldCheck,
  Target,
  Eye,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Equipment listed" },
  { value: "200+", label: "Verified owners" },
  { value: "1,200+", label: "Successful rentals" },
  { value: "8", label: "Cities covered" },
];

const values = [
  { icon: BadgeCheck, title: "Verified owners", text: "Every listing is reviewed and approved by our admin team before it goes live." },
  { icon: CreditCard, title: "Secure payments", text: "All payments are handled by Stripe, so your money and data stay protected." },
  { icon: CalendarClock, title: "Flexible periods", text: "Rent by the day, week or month, whatever fits your project." },
  { icon: Handshake, title: "Fair for everyone", text: "Owners earn from idle equipment and customers save on buying." },
];

const steps = [
  { icon: Search, title: "Find", text: "Search and filter equipment by category, location and price." },
  { icon: CalendarClock, title: "Book", text: "Pick your dates and quantity, and see the total instantly." },
  { icon: ShieldCheck, title: "Pay & Receive", text: "Pay securely online and get the equipment delivered." },
];

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const AboutPage = () => {
  return (
    <main className="relative overflow-hidden bg-[#09090b] pb-20 pt-32">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#3b82f6]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-24 px-4">
        {/* hero */}
        <motion.div {...fade} className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-4 py-1.5 text-sm text-[#3b82f6]">
            About GearVault
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            Rent the right equipment, without owning it
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#a1a1aa]">
            GearVault is a rental marketplace that connects equipment owners with people who need
            tools, cameras, vehicles and machinery for a specific period, in a transparent and secure way.
          </p>
        </motion.div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
            >
              <p className="text-3xl font-extrabold text-[#3b82f6]">{s.value}</p>
              <p className="mt-1 text-sm text-[#a1a1aa]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* mission & vision */}
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our mission", text: "Make professional equipment affordable and accessible to everyone by turning unused gear into opportunity." },
            { icon: Eye, title: "Our vision", text: "Become the most trusted rental platform in Bangladesh, where every rental is simple, safe and fair." },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-[#3b82f6]/50"
            >
              <Icon className="h-8 w-8 text-[#3b82f6]" />
              <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>
              <p className="mt-3 leading-relaxed text-[#a1a1aa]">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* values */}
        <div>
          <motion.div {...fade} className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white">Why people trust us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
              Built around trust, clarity and convenience.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3b82f6]/15">
                  <Icon className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* how it works */}
        <div>
          <motion.div {...fade} className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white">How it works</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <span className="absolute right-5 top-4 text-5xl font-extrabold text-white/5">0{i + 1}</span>
                <Icon className="h-7 w-7 text-[#3b82f6]" />
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-[#a1a1aa]">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          {...fade}
          className="rounded-2xl border border-[#3b82f6]/30 bg-gradient-to-br from-[#3b82f6]/20 to-transparent p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#a1a1aa]">
            Browse equipment today, or list your own and start earning.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/all-equipment" className="rounded-lg bg-[#3b82f6] px-6 py-3 text-sm font-medium text-white hover:bg-[#2563eb]">
              Browse Equipment
            </Link>
            <Link href="/contact" className="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AboutPage;