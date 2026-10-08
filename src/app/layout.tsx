
import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, দামের পরিবর্তন ও বাজারভিত্তিক তথ্য এক জায়গায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          {/* Common Navbar */}
          <Header />

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Common Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
