
export default function Footer() {
  return (
    <footer className="mt-12 border-t border-emerald-100 bg-[#fafcfa]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:text-left">

        {/* Left: Assignment Required Text */}
        <p className="text-sm font-semibold text-emerald-900 lg:whitespace-nowrap">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        {/* Right: Assignment Required Disclaimer */}
        <p className="text-sm leading-6 text-slate-500 lg:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>

      </div>
    </footer>
  );
}
