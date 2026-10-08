
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-2xl border border-emerald-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10">

        {/* Error Icon */}
        <div className="mb-5 text-6xl">
          🔎
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-extrabold text-emerald-700 sm:text-7xl">
          404
        </h1>

        {/* Error Message */}
        <h2 className="mt-5 text-2xl font-extrabold text-emerald-950 sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো
          সরিয়ে ফেলা হয়েছে অথবা URL সঠিক নয়।
          অনুগ্রহ করে হোম পেজে ফিরে যান।
        </p>

        {/* Back to Home */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
        >
          <span aria-hidden="true">←</span>
          হোম পেজে ফিরে যান
        </Link>

      </div>
    </section>
  );
}
