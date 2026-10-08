
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">

      {/* Hero Section */}
      <Hero />

      {/* All Products Section */}
      <section
        id="সব-পণ্য"
        className="scroll-mt-8 py-12"
        aria-labelledby="products-title"
      >
        <div className="mb-5">
          <h2
            id="products-title"
            className="text-2xl font-extrabold text-emerald-950 sm:text-3xl"
          >
            সব পণ্য
          </h2>

          <p className="mt-2 text-slate-600">
            চাল, ডাল, তেল, সবজি এবং অন্যান্য
            নিত্যপণ্যের বাজারদর।
          </p>
        </div>

        {/* Product API will be added next */}
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-600">
          পণ্যের বিস্তারিত বাজারদর শীঘ্রই এখানে
          দেখানো হবে।
        </div>
      </section>
    </div>
  );
}
