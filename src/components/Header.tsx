
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import AuthNav from "@/components/AuthNav";

import {
  type Product,
  formatBanglaNumber,
  formatBanglaPrice,
  formatUnit,
} from "@/lib/products";

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

function PriceTicker() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTicker() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Ticker API failed");
        }

        const data = await response.json();

        
if (Array.isArray(data.products)) {
  const changedProducts = (data.products as Product[])
    .filter(
      (product) =>
        typeof product.changePercent === "number" &&
        product.changePercent !== 0
    );

  setProducts(changedProducts);
}

      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Ticker Error:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTicker();

    return () => controller.abort();
  }, []);

  return (
    <div className="overflow-hidden border-t border-emerald-100 bg-[#f7fbf7]">
      <div className="flex items-center gap-3">
        <span className="z-10 shrink-0 bg-emerald-800 px-3 py-2 text-xs font-bold text-white sm:px-5">
          আজকের দর
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          {loading ? (
            <p className="py-2 text-sm text-slate-500">
              বাজারদর লোড হচ্ছে...
            </p>
          ) : products.length === 0 ? (
            <p className="py-2 text-sm text-slate-500">
              বাজারদর পাওয়া যাচ্ছে না।
            </p>
          ) : (
            <div className="ticker-track flex w-max items-center">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 items-center"
                  aria-hidden={copy === 1}
                >
                  {products.map((product) => {
                    const change = product.changePercent;

                    const changeText =
                      change === null
                        ? "—"
                        : `${
                            change > 0
                              ? "▲"
                              : change < 0
                                ? "▼"
                                : "—"
                          } ${formatBanglaNumber(
                            Math.abs(change),
                            1
                          )}%`;

                    return (
                      <div
                        key={`${copy}-${product.id}`}
                        className="flex shrink-0 items-center gap-2 px-5 text-sm text-slate-700"
                      >
                        <span>{product.emoji}</span>

                        <span className="font-semibold">
                          {product.name}
                        </span>

                        <span>
                          {formatBanglaPrice(product.price)}
                          /
                          {formatUnit(product.unit).replace(
                            /^প্রতি\s*/,
                            ""
                          )}
                        </span>

                        <span
                          className={`font-bold ${
                            change !== null && change > 0
                              ? "text-emerald-700"
                              : change !== null && change < 0
                                ? "text-red-600"
                                : "text-slate-500"
                          }`}
                        >
                          {changeText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  const [dateText, setDateText] =
    useState("আজকের বাজারদর");

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
    
<header className="sticky top-0 z-50 border-b border-emerald-100 bg-[#fafcfa]">

    
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="BazarDor Home"
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

      
        <AuthNav />
      </div>

  
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
