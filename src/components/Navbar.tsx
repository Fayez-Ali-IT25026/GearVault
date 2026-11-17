"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/equipment" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = null; // replace with your BetterAuth session

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-[var(--font-manrope)] text-xl font-bold">
          <ShieldCheck className="h-6 w-6 text-[#3b82f6]" />
          <span className="text-white">Gear<span className="text-[#3b82f6]">Vault</span></span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.name}>
              <Link href={l.href} className="text-sm text-[#a1a1aa] transition hover:text-white">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Dashboard
              </Link>
              <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Register
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="text-white md:hidden" aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#09090b] md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              {links.map((l) => (
                <Link key={l.name} href={l.href} onClick={() => setOpen(false)} className="text-[#a1a1aa] hover:text-white">
                  {l.name}
                </Link>
              ))}
              <Link href="/login" className="text-white">Login</Link>
              <Link href="/register" className="rounded-lg bg-[#3b82f6] px-4 py-2 text-center text-white">Register</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;