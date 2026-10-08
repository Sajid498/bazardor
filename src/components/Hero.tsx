
import Image from "next/image";

export default function Hero() {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-[#fafcfa] px-5 py-7 shadow-sm sm:px-8 sm:py-9 lg:px-9 lg:py-10">
      <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-5">

        {/* Hero Content */}
        <div className="min-w-0">
          <p className="mb-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:text-sm">
            🛒 আজকের বাজারদর
          </p>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-[34px] lg:text-[36px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও
            মসলার দাম — বাজারভিত্তিক বিস্তারিত,
            গড়, সর্বনিম্ন ও সর্বোচ্চ দাম জানুন সহজে।
          </p>

          {/* Hero CTA */}
          <a
            href="#সব-পণ্য"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 sm:text-base"
          >
            সব পণ্য দেখুন
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Hero Illustration */}
        <div className="flex items-center justify-center lg:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="ফল ও সবজিতে ভরা বাজারের ঝুড়ি"
            width={360}
            height={300}
            priority
            className="h-auto w-full max-w-[290px] object-contain sm:max-w-[330px] lg:max-w-[360px]"
          />
        </div>

      </div>
    </section>
  );
}
