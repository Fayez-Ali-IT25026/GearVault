"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const links = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/equipment" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

type NavUser = {
  name: string;
  email: string;
  image?: string | null;
};

function Avatar({ user, size = 32 }: { user: NavUser; size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3b82f6] text-sm font-bold text-white"
    >
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        (user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()
      )}
    </span>
  );
}

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as NavUser | undefined;

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();

    setMenuOpen(false);
    setOpen(false);
    toast.success("Signed out", "You have been logged out successfully.");

    router.push("/");
    router.refresh();
  };

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
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition hover:border-white/20 hover:bg-white/10"
                aria-label="Open user menu"
              >
                <Avatar user={user} />
                <span className="max-w-[120px] truncate text-sm font-medium text-white">
                  {user.name}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#a1a1aa] transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-[16px] border border-white/10 bg-[#13141b] shadow-2xl shadow-black/60"
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 p-4">
                      <Avatar user={user} size={40} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                        <p className="truncate text-xs text-[#a1a1aa]">{user.email}</p>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-[#d4d4d8] transition hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="mt-1 flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

              {user ? (
                <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                      <p className="truncate text-xs text-[#a1a1aa]">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-[10px] px-2 py-2 text-sm text-white hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 rounded-[10px] px-2 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="text-white">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-center text-white">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
