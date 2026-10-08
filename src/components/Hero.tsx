
import Image from "next/image";

export default function Hero() {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-[#fafcfa] px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10">
      <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">

    
        <div>
          <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            🛒 নিত্যপণ্যের বাজারদর
          </p>

          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও
            মসলার দাম — বাজারভিত্তিক বিস্তারিত,
            গড়, সর্বনিম্ন ও সর্বোচ্চ দাম জানুন সহজে।
          </p>

    
          <a
            href="#সব-পণ্য"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            সব পণ্য দেখুন
            <span aria-hidden="true">→</span>
          </a>
        </div>

       
        <div className="flex justify-center md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="ফল ও সবজিতে ভরা বাজারের ঝুড়ি"
            width={315}
            height={263}
            priority
            className="h-auto w-full max-w-[315px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
