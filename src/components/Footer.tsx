
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-emerald-100 bg-[#fafcfa]">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center">

     
        <div>
          <Link
            href="/"
            className="text-lg font-extrabold text-emerald-900"
          >
            🛒 বাজার দর
          </Link>

          <p className="mt-1 text-sm text-slate-600">
            প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>

    
        <p className="max-w-sm text-sm leading-6 text-slate-500 md:text-right">
          বাজার পরিস্থিতি ও স্থানভেদে পণ্যের
          দাম পরিবর্তিত হতে পারে।
        </p>
      </div>
    </footer>
  );
}
