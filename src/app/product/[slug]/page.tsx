
import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth";

import {
  getProductDetails,
  getMarketSummary,
  formatBn,
  formatPrice,
  formatProductUnit,
  type ProductDetails,
} from "@/lib/product-details";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata = {
  title: "পণ্যের বিস্তারিত | বাজার দর",
  description:
    "বাংলাদেশের বিভিন্ন বাজারে নিত্যপণ্যের দাম দেখুন।",
};

function PriceSummary({
  product,
}: {
  product: ProductDetails;
}) {
  const summary = getMarketSummary(product.markets);

  const cards = [
    {
      title: "সর্বনিম্ন দাম",
      value: formatPrice(summary.minimum),
      icon: "📉",
      color: "text-emerald-700",
      background: "bg-emerald-50",
    },
    {
      title: "সর্বোচ্চ দাম",
      value: formatPrice(summary.maximum),
      icon: "📈",
      color: "text-red-700",
      background: "bg-red-50",
    },
    {
      title: "আনুমানিক বাজারগড়",
      value: formatPrice(summary.estimatedAverage),
      icon: "📊",
      color: "text-blue-700",
      background: "bg-blue-50",
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="mb-5 text-2xl font-extrabold text-emerald-950">
        দামের সারসংক্ষেপ
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border border-slate-100 p-6 shadow-sm ${card.background}`}
          >
            <span className="text-3xl">{card.icon}</span>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              {card.title}
            </p>

            <p
              className={`mt-2 text-2xl font-extrabold ${card.color}`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম API থেকে
        নেওয়া হয়েছে। আনুমানিক বাজারগড় প্রতিটি
        বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দু
        থেকে হিসাব করা হয়েছে।
      </p>
    </section>
  );
}

function PriceHistory({
  product,
}: {
  product: ProductDetails;
}) {
  const prices = [
    {
      label: "আজকের দাম",
      value: product.today,
    },
    {
      label: "গতকালের দাম",
      value: product.yesterday,
    },
    {
      label: "গত সপ্তাহের দাম",
      value: product.lastWeek,
    },
    {
      label: "গত মাসের দাম",
      value: product.lastMonth,
    },
  ];

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-extrabold text-emerald-950">
        আগের দামের তুলনা
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {prices.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {item.label}
            </p>

            <p className="mt-2 text-xl font-extrabold text-emerald-900">
              {formatPrice(item.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketPriceTable({
  product,
}: {
  product: ProductDetails;
}) {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-emerald-950">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <p className="mt-2 text-slate-600">
          মোট {formatBn(product.markets.length)}টি
          বাজারের সর্বনিম্ন ও সর্বোচ্চ মূল্য।
        </p>
      </div>

      {product.markets.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[570px] border-collapse text-left">
              <thead className="bg-emerald-800 text-white">
                <tr>
                  <th className="px-5 py-4 text-sm font-bold">
                    বাজারের নাম
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    বিভাগ
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-bold">
                    সর্বনিম্ন
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-bold">
                    সর্বোচ্চ
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-emerald-50/60"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      <span className="mr-2">📍</span>
                      {market.market}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {market.division}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-emerald-700">
                      {formatPrice(market.min)}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-red-600">
                      {formatPrice(market.max)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { slug } = await params;

  // 1. Verify the session on the server.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Guests must sign in before viewing details.
  if (!session?.user) {
    const returnPath = `/product/${encodeURIComponent(
      slug
    )}`;

    redirect(
      `/signin?callbackUrl=${encodeURIComponent(
        returnPath
      )}&reason=protected`
    );
  }

  // 3. Validate the dynamic route parameter.
  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    notFound();
  }

  // 4. Fetch the actual product.
  let product: ProductDetails | null;

  try {
    product = await getProductDetails(slug);
  } catch (error) {
    console.error(
      "Unable to load product details:",
      error
    );

    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="text-6xl">⚠️</div>

          <h1 className="mt-5 text-2xl font-extrabold text-red-700">
            পণ্যের তথ্য লোড করা যায়নি
          </h1>

          <p className="mt-3 text-slate-600">
            API সার্ভারে সাময়িক সমস্যা হয়েছে।
            কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>

          <Link
            href={`/product/${encodeURIComponent(slug)}`}
            className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white"
          >
            আবার চেষ্টা করুন
          </Link>
        </div>
      </section>
    );
  }

  // 5. Show 404 for an unknown product.
  if (!product) {
    notFound();
  }

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const changeBadge = isUp
    ? "bg-emerald-100 text-emerald-700"
    : isDown
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-600";

  const changeSymbol = isUp
    ? "▲"
    : isDown
      ? "▼"
      : "—";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-sm text-slate-500"
      >
        <Link
          href="/"
          className="hover:text-emerald-700"
        >
          হোম
        </Link>

        <span className="mx-2">/</span>

        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-700"
        >
          {product.categoryNameBn}
        </Link>

        <span className="mx-2">/</span>

        <span className="font-semibold text-emerald-800">
          {product.nameBn}
        </span>
      </nav>

      {/* Product Summary */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-7xl">
            {product.image}
          </div>

          <div className="flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-800">
                {product.categoryIcon}{" "}
                {product.categoryNameBn}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-600">
                {formatProductUnit(product.unit)}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-emerald-950 sm:text-4xl">
              {product.nameBn}
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              বাংলাদেশের{" "}
              {formatBn(product.markets.length)}
              টি বাজারের সর্বশেষ মূল্যতথ্য ও
              আগের দামের তুলনা।
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  আজকের দাম
                </p>

                <p className="mt-1 text-3xl font-extrabold text-red-600">
                  {formatPrice(product.today)}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${changeBadge}`}
              >
                {changeSymbol}{" "}
                {formatBn(product.change.pct, 1)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <PriceSummary product={product} />

      <PriceHistory product={product} />

      <MarketPriceTable product={product} />

      {/* Footer Navigation */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
        >
          ← সব পণ্য দেখুন
        </Link>
      </div>
    </div>
  );
}
