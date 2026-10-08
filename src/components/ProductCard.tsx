
import Link from "next/link";

import {
  type Product,
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

  let badgeColor = "bg-slate-100 text-slate-600";

  if (isUp) {
    badgeColor = "bg-emerald-100 text-emerald-700";
  }

  if (isDown) {
    badgeColor = "bg-red-100 text-red-700";
  }

  const formattedChange =
    change === null
      ? null
      : new Intl.NumberFormat("bn-BD", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(Math.abs(change));

  const changeText =
    formattedChange === null
      ? "তথ্য নেই"
      : `${
          isUp ? "▲" : isDown ? "▼" : "—"
        } ${formattedChange}%`;

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-emerald-300 hover:shadow-md sm:p-5"
    >
      {/* Product Name and Icon */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl">
          <span role="img" aria-label={product.name}>
            {product.emoji}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-6 text-slate-800 transition group-hover:text-emerald-700">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {formatUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Current Price and Change */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">
            আজকের দাম
          </p>

          <p className="mt-1 text-xl font-extrabold text-slate-900">
            {formatBanglaPrice(product.price)}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}
        >
          {changeText}
        </span>
      </div>
    </Link>
  );
}
