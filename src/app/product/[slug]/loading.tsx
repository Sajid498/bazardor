
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6"
      role="status"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
    >
  
      <div className="mb-7 h-5 w-52 rounded bg-slate-200" />

 
      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="h-28 w-28 rounded-2xl bg-slate-200" />

          <div className="flex-1 space-y-4">
            <div className="h-6 w-24 rounded-full bg-slate-200" />

            <div className="h-10 w-60 max-w-full rounded bg-slate-200" />

            <div className="h-5 w-full max-w-md rounded bg-slate-200" />

            <div className="h-9 w-40 rounded bg-slate-200" />
          </div>
        </div>
      </div>


      <div className="mt-10 h-8 w-56 rounded bg-slate-200" />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl bg-white p-6"
          >
            <div className="h-6 w-20 rounded bg-slate-200" />

            <div className="mt-6 h-8 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>

 
      <div className="mt-10 h-8 w-64 rounded bg-slate-200" />

      <div className="mt-5 space-y-3 rounded-2xl bg-white p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-12 rounded bg-slate-100"
          />
        ))}
      </div>

      <span className="sr-only">
        পণ্যের তথ্য লোড হচ্ছে...
      </span>
    </div>
  );
}
