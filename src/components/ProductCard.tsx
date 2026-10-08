
import Link from "next/link";

import {
  Product,
  formatBanglaNumber,
  formatBanglaPrice,
  formatUnit,
} from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const change = product.changePercent;

  const isUp = change !== null && change > 0;
  const isDown = change !== null && change < 0;

  let badgeColor =
    "bg-slate-100 text-slate-600";

  if (isUp) {
    badgeColor =
      "bg-emerald-100 text-emerald-700";
  }

  if (isDown) {
    badgeColor =
      "bg-red-100 text-red-700";
  }

  const changeText =
    change === null
      ? "তথ্য নেই"
      : `${
          isUp ? "▲" : isDown ? "▼" : "—"
        } ${formatBanglaNumber(
          Math.abs(change),
          1
        )}%`;

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      {/* Product Emoji */}
      <div className="mb-4 flex h-20 items-center justify-center rounded-xl bg-[#f2f8f2] text-5xl">
        <span role="img" aria-label={product.name}>
          {product.emoji}
        </span>
      </div>

      {/* Product Name */}
      <div className="flex-1">
        <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-emerald-800">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {formatUnit(product.unit)}
        </p>
      </div>

      <div className="my-4 border-t border-slate-100" />

      {/* Today Price */}
      <p className="text-xs font-semibold text-slate-500">
        আজকের দাম
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xl font-extrabold text-red-600">
          {formatBanglaPrice(product.price)}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}
        >
          {changeText}
        </span>
      </div>

      {/* Details Link Text */}
      <div className="mt-4 text-sm font-bold text-emerald-700">
        বিস্তারিত দেখুন →
      </div>
    </Link>
  );
}
