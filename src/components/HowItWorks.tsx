"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, CreditCard, PackageCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Browse Equipment",
    description: "Search by name, location or category and find the right equipment.",
    icon: Search,
  },
  {
    number: "02",
    title: "Book Your Dates",
    description: "Pick your rental period and quantity, then send your booking.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Pay Securely",
    description: "Complete your payment online with Stripe in a few clicks.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Pick Up & Use",
    description: "Get your equipment, finish your work and return it on time.",
    icon: PackageCheck,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#09090b] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            Rent equipment in four simple steps.
          </p>
        </div>

        {/* steps */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <span className="absolute right-5 top-4 text-4xl font-bold text-white/10">
                {step.number}
              </span>
              <div className="mb-4 inline-block rounded-lg bg-[#3b82f6]/15 p-4">
                <step.icon className="h-7 w-7 text-[#3b82f6]" />
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-[#a1a1aa]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;