
export default function ProductSkeleton() {
  return (
    <div
      className="space-y-10 py-8"
      role="status"
      aria-label="পণ্য লোড হচ্ছে"
    >
      {[1, 2, 3].map((section) => (
        <section key={section}>
          <div className="mb-6 space-y-2">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

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

                  <div className="mt-8 h-6 w-28 rounded bg-slate-200" />
                </div>
              )
            )}
          </div>
        </section>
      ))}
      <span className="sr-only">পণ্য লোড হচ্ছে...</span>
    </div>
  );
}
