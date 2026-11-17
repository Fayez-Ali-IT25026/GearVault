"use client";

import { motion } from "framer-motion";
import { BadgeDollarSign, ShieldCheck, CalendarClock, Lock } from "lucide-react";

const features = [
  {
    title: "Affordable Prices",
    description: "Rent only what you need and save money compared to buying expensive equipment.",
    icon: BadgeDollarSign,
  },
  {
    title: "Verified Owners",
    description: "Every owner and listing is reviewed and approved by our admin team.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Rental Periods",
    description: "Choose daily, weekly or monthly rental plans that fit your project.",
    icon: CalendarClock,
  },
  {
    title: "Secure Payments",
    description: "Pay safely online with Stripe. Your payment details stay protected.",
    icon: Lock,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-[#09090b] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">Why Choose GearVault</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            A simple, safe and transparent way to rent the equipment you need.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <div className="mb-4 inline-block rounded-lg bg-[#3b82f6]/15 p-4">
                <item.icon className="h-7 w-7 text-[#3b82f6]" />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-[#a1a1aa]">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;