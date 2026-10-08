
export default function Loading() {
  return (
    <div
      className="py-4"
      role="status"
      aria-label="ক্যাটাগরির পণ্য লোড হচ্ছে"
    >
      {/* Toolbar Skeleton */}
      <div className="mb-6 flex animate-pulse items-center justify-between rounded-xl bg-white p-5">
        <div className="h-5 w-28 rounded bg-slate-200" />

        <div className="h-10 w-48 rounded-lg bg-slate-200" />
      </div>

      {/* Product Skeletons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5"
            >
              <div className="h-20 rounded-xl bg-slate-200" />

              <div className="mt-5 h-6 w-36 rounded bg-slate-200" />

              <div className="mt-3 h-4 w-20 rounded bg-slate-200" />

              <div className="mt-8 h-6 w-32 rounded bg-slate-200" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
