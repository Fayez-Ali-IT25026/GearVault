
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const XLogo = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#09090b]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <ShieldCheck className="h-6 w-6 text-[#3b82f6]" />
            <span className="text-white">
              Gear<span className="text-[#3b82f6]">Vault</span>
            </span>
          </Link>

          <p className="mt-4 text-sm text-[#a1a1aa]">
            A secure rental marketplace that connects equipment owners and customers.
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="X"
              className="rounded-lg border border-white/10 p-2 text-[#a1a1aa] hover:text-white transition"
            >
              <XLogo />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="rounded-lg border border-white/10 p-2 text-[#a1a1aa] hover:text-white transition"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-lg border border-white/10 p-2 text-[#a1a1aa] hover:text-white transition"
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-lg border border-white/10 p-2 text-[#a1a1aa] hover:text-white transition"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/equipment" className="hover:text-white">
                All Equipment
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="hover:text-white">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 font-semibold text-white">
            Categories
          </h3>

          <ul className="space-y-2 text-sm text-[#a1a1aa]">
            <li>Construction Equipment</li>
            <li>Photography Equipment</li>
            <li>Vehicles & Transportation</li>
            <li>Event Equipment</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-semibold text-white">
            Contact
          </h3>

          <ul className="space-y-3 text-sm text-[#a1a1aa]">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#3b82f6]" />
              support@gearvault.com
            </li>

            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#3b82f6]" />
              +880 1234 567890
            </li>

            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#3b82f6]" />
              Tangail, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-[#a1a1aa]">
       © 2026 GearVault. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
