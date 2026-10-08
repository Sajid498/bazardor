
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const categories = [
  { label: "চাল", emoji: "🍚", slug: "chal" },
  { label: "ডাল", emoji: "🫘", slug: "dal" },
  { label: "তেল", emoji: "🛢️", slug: "tel" },
  { label: "সবজি", emoji: "🥬", slug: "shobji" },
  { label: "মাছ", emoji: "🐟", slug: "mach" },
  { label: "মাংস", emoji: "🍗", slug: "mangsho" },
  { label: "ডিম-দুধ", emoji: "🥛", slug: "dim-dudh" },
  { label: "মসলা", emoji: "🌶️", slug: "moshla" },
];

// Temporary sample prices for UI design.
// Real API data will be added in the next commit.
const samplePrices = [
  {
    emoji: "🍚",
    name: "স্বর্ণমাছি চাল",
    price: "১৪৮ টাকা/কেজি",
    change: "▲ ২.১%",
    up: true,
  },
  {
    emoji: "🍚",
    name: "মিনিকেট চাল",
    price: "৯৯ টাকা/কেজি",
    change: "▼ ২.৯%",
    up: false,
  },
  {
    emoji: "🍚",
    name: "বাটাম সাইজ চাল",
    price: "৬৬ টাকা/কেজি",
    change: "▲ ৩.১%",
    up: true,
  },
  {
    emoji: "🫘",
    name: "মসুর ডাল",
    price: "১৪২ টাকা/কেজি",
    change: "▲ ২.৯%",
    up: true,
  },
  {
    emoji: "🫘",
    name: "ছোলা",
    price: "১২০ টাকা/কেজি",
    change: "▼ ২.৪%",
    up: false,
  },
];

function PriceTicker() {
  return (
    <div
      className="overflow-hidden border-t border-emerald-100 bg-[#f7fbf7]"
      aria-label="ডিজাইনের নমুনা বাজারদর"
    >
      <div className="flex items-center gap-3">
        <span className="z-10 shrink-0 bg-emerald-800 px-3 py-2 text-xs font-bold text-white sm:px-5">
          নমুনা দর
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                className="flex shrink-0 items-center"
                key={copy}
                aria-hidden={copy === 1}
              >
                {samplePrices.map((item) => (
                  <div
                    key={`${copy}-${item.name}`}
                    className="flex shrink-0 items-center gap-2 px-5 text-sm text-slate-700"
                  >
                    <span>{item.emoji}</span>

                    <span className="font-semibold">
                      {item.name}
                    </span>

                    <span>{item.price}</span>

                    <span
                      className={
                        item.up
                          ? "font-bold text-emerald-700"
                          : "font-bold text-red-600"
                      }
                    >
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  const [dateText, setDateText] = useState(
    "আজকের বাজারদর"
  );

  useEffect(() => {
    setDateText(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  return (
    <header className="border-b border-emerald-100 bg-[#fafcfa]">
      {/* Top Navbar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="বাজার দর - হোম"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={24}
              height={24}
            />
          </span>

          <span className="flex flex-col">
            <strong className="text-xl leading-6 text-emerald-900">
              বাজার দর
            </strong>

            <span className="text-xs text-slate-500">
              {dateText}
            </span>
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/signin"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 sm:px-4"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:px-5"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      {/* Category Navigation */}
      <nav
        aria-label="পণ্য ক্যাটাগরি"
        className="border-t border-emerald-100"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:gap-2 sm:px-6">
          {categories.map((category) => {
            const href = `/category/${category.slug}`;
            const active = pathname === href;

            return (
              <Link
                key={category.slug}
                href={href}
                aria-current={
                  active ? "page" : undefined
                }
                className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "text-slate-700 hover:bg-emerald-100 hover:text-emerald-900"
                }`}
              >
                <span className="mr-1">
                  {category.emoji}
                </span>
                {category.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <PriceTicker />
    </header>
  );
}
