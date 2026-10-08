
import Link from "next/link";

import ProductCard from "@/components/ProductCard";

import {
  getProducts,
  Product,
} from "@/lib/products";

type SectionProps = {
  title: string;
  subtitle: string;
  products: Product[];
  id?: string;
};

function ProductSection({
  title,
  subtitle,
  products,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-8 py-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 text-slate-600">
          {subtitle}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          এই বিভাগে বর্তমানে কোনো পণ্য নেই।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function HomeProducts() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Product loading failed:", error);

    return (
      <section
        id="সব-পণ্য"
        className="py-12"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-800">
            পণ্যের তথ্য লোড করা যায়নি
          </h2>

          <p className="mt-2 text-red-700">
            API সংযোগে সমস্যা হয়েছে।
            কিছুক্ষণ পরে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-red-700 px-5 py-2 text-white"
          >
            আবার চেষ্টা করুন
          </Link>
        </div>
      </section>
    );
  }

  const topRisers = products
    .filter(
      (product) =>
        product.changePercent !== null &&
        product.changePercent > 0
    )
    .sort(
      (a, b) =>
        (b.changePercent ?? 0) -
        (a.changePercent ?? 0)
    )
    .slice(0, 6);

  const topFallers = products
    .filter(
      (product) =>
        product.changePercent !== null &&
        product.changePercent < 0
    )
    .sort(
      (a, b) =>
        (a.changePercent ?? 0) -
        (b.changePercent ?? 0)
    )
    .slice(0, 6);

  return (
    <>
      <ProductSection
        title="আজ দাম বেড়েছে ▲"
        subtitle="যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে"
        products={topRisers}
      />

      <ProductSection
        title="আজ দাম কমেছে ▼"
        subtitle="যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে"
        products={topFallers}
      />

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle="নিত্যপ্রয়োজনীয় সব পণ্যের সর্বশেষ বাজারদর"
        products={products}
      />
    </>
  );
}
