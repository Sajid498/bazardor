
import { Suspense } from "react";

import Hero from "@/components/Hero";
import HomeProducts from "@/components/HomeProducts";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      {/* Hero Banner */}
      <Hero />

      {/* Product Sections */}
      <Suspense fallback={<ProductSkeleton />}>
        <HomeProducts />
      </Suspense>
    </div>
  );
}
