
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CategorySortProducts from "@/components/CategorySortProducts";
import { getCategoryProducts } from "@/lib/category-products";

import Loading from "./loading";

const categories = {
  chal: {
    title: "চাল",
    icon: "🍚",
    description:
      "বিভিন্ন ধরনের চালের আজকের বাজারদর এবং দামের পরিবর্তন দেখুন।",
  },
  dal: {
    title: "ডাল",
    icon: "🫘",
    description:
      "বিভিন্ন ধরনের ডালের সর্বশেষ বাজারদর দেখুন।",
  },
  tel: {
    title: "তেল",
    icon: "🛢️",
    description:
      "ভোজ্যতেলের বর্তমান দাম এবং দামের পরিবর্তন জানুন।",
  },
  shobji: {
    title: "সবজি",
    icon: "🥬",
    description:
      "টাটকা শাকসবজির বাজারভিত্তিক দাম দেখুন।",
  },
  mach: {
    title: "মাছ",
    icon: "🐟",
    description:
      "বিভিন্ন ধরনের মাছের বাজারদর দেখুন।",
  },
  mangsho: {
    title: "মাংস",
    icon: "🍗",
    description:
      "মাংসের বর্তমান বাজারদর এবং পরিবর্তন জানুন।",
  },
  "dim-dudh": {
    title: "ডিম ও দুধ",
    icon: "🥛",
    description:
      "ডিম ও দুধের সর্বশেষ বাজারদর দেখুন।",
  },
  moshla: {
    title: "মসলা",
    icon: "🌶️",
    description:
      "নিত্যপ্রয়োজনীয় মসলার দাম দেখুন।",
  },
};

type CategorySlug = keyof typeof categories;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function getCategory(slug: string) {
  if (
    !Object.prototype.hasOwnProperty.call(
      categories,
      slug
    )
  ) {
    return null;
  }

  return categories[slug as CategorySlug];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {
      title: "ক্যাটাগরি পাওয়া যায়নি | বাজার দর",
    };
  }

  return {
    title: `${category.title} | বাজার দর`,
    description: category.description,
  };
}

async function CategoryContent({
  slug,
}: {
  slug: string;
}) {
  try {
    const products = await getCategoryProducts(slug);

    return (
      <CategorySortProducts products={products} />
    );
  } catch (error) {
    console.error(
      "Category page loading error:",
      error
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <div className="mb-4 text-5xl">⚠️</div>

        <h2 className="text-2xl font-bold text-red-800">
          পণ্যের তথ্য লোড করা যায়নি
        </h2>

        <p className="mt-3 text-red-700">
          সার্ভারের সঙ্গে যোগাযোগ করতে সমস্যা
          হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

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

        <span className="font-semibold text-emerald-800">
          {category.title}
        </span>
      </nav>

      {/* Category Header */}
      <div className="mb-8 rounded-2xl border border-emerald-100 bg-[#fafcfa] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-5xl">
            {category.icon}
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-emerald-950 sm:text-4xl">
              {category.title}
            </h1>

            <p className="mt-2 leading-7 text-slate-600">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Product List */}
      <Suspense fallback={<Loading />}>
        <CategoryContent slug={slug} />
      </Suspense>
    </div>
  );
}
