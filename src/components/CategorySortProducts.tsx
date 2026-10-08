
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

type SortOption = "default" | "low" | "high";

type Props = {
  products: Product[];
};

export default function CategorySortProducts({
  products,
}: Props) {
  const [sortOption, setSortOption] =
    useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sortOption === "default") {
      return items;
    }

    items.sort((a, b) => {
      // Products with missing price go last.
      if (a.price === null && b.price === null) {
        return 0;
      }

      if (a.price === null) return 1;
      if (b.price === null) return -1;

      if (sortOption === "low") {
        return a.price - b.price;
      }

      return b.price - a.price;
    });

    return items;
  }, [products, sortOption]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mb-5 text-6xl">🔎</div>

        <h2 className="text-2xl font-extrabold text-slate-800">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          এই বিভাগে বর্তমানে কোনো পণ্যের তথ্য
          নেই। অন্য ক্যাটাগরি থেকে পণ্য দেখতে
          পারেন।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-600">
          মোট পণ্য:{" "}
          <span className="text-emerald-800">
            {new Intl.NumberFormat("bn-BD").format(
              products.length
            )}
          </span>
          টি
        </p>

        <div className="flex items-center gap-3">
          <label
            htmlFor="category-sort"
            className="shrink-0 text-sm font-bold text-slate-700"
          >
            সাজান:
          </label>

          <select
            id="category-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target.value as SortOption
              )
            }
            className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-auto"
          >
            <option value="default">ডিফল্ট</option>

            <option value="low">
              দাম: কম থেকে বেশি
            </option>

            <option value="high">
              দাম: বেশি থেকে কম
            </option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
