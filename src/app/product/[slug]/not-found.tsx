
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-6xl items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-100 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mb-5 text-7xl">🔎</div>

        <h1 className="text-5xl font-extrabold text-emerald-800">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-extrabold text-slate-800">
          পণ্যটি খুঁজে পাওয়া যায়নি
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          আপনি যে পণ্যটি খুঁজছেন সেটি আমাদের
          তালিকায় নেই। অনুগ্রহ করে অন্য কোনো
          পণ্য নির্বাচন করুন।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
