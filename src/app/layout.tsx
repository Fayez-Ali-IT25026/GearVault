import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toast";

export const instant = false;

export const metadata: Metadata = {
  title: "GearVault | Equipment Rental Platform",
  description: "Rent the equipment you need, when you need it. Browse and book construction, photography, vehicles, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
         <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
