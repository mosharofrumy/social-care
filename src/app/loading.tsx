function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-gray-200 motion-reduce:animate-none dark:bg-gray-800 ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading Social Care"
      className="flex-1 bg-gray-50 px-4 py-8 transition-colors dark:bg-gray-950 sm:px-6 sm:py-12"
    >
      <span className="sr-only">Loading Social Care...</span>
      <div aria-hidden="true" className="mx-auto max-w-7xl">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-12 sm:px-10 sm:py-16 lg:min-h-100 lg:px-14 lg:py-20">
          <div className="absolute -right-16 -top-28 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -bottom-36 right-1/4 size-72 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="relative max-w-2xl space-y-5">
            <SkeletonBlock className="h-9 w-48 rounded-full bg-emerald-800/80" />
            <div className="space-y-3">
              <SkeletonBlock className="h-10 w-full max-w-lg bg-emerald-800/80 sm:h-12" />
              <SkeletonBlock className="h-10 w-4/5 max-w-md bg-emerald-800/80 sm:h-12" />
            </div>
            <div className="space-y-2 pt-1">
              <SkeletonBlock className="h-4 w-full max-w-xl bg-emerald-800/70" />
              <SkeletonBlock className="h-4 w-5/6 max-w-lg bg-emerald-800/70" />
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <SkeletonBlock className="h-12 w-full max-w-44 rounded-xl bg-emerald-700/80" />
              <SkeletonBlock className="h-12 w-full max-w-48 rounded-xl bg-emerald-800/80" />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <SkeletonBlock className="size-12 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-3 pt-1">
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div className="w-full max-w-md space-y-3">
              <SkeletonBlock className="h-3 w-32 bg-emerald-200 dark:bg-emerald-900" />
              <SkeletonBlock className="h-8 w-64" />
              <SkeletonBlock className="h-4 w-full max-w-sm" />
            </div>
            <SkeletonBlock className="hidden h-10 w-32 rounded-xl sm:block" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <SkeletonBlock className="h-44 rounded-none bg-gray-300 dark:bg-gray-800" />
                <div className="space-y-4 p-5">
                  <SkeletonBlock className="h-3 w-24 bg-emerald-200 dark:bg-emerald-900" />
                  <SkeletonBlock className="h-5 w-3/4" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-5/6" />
                  <div className="flex items-center justify-between pt-2">
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="h-10 w-28 rounded-xl bg-emerald-200 dark:bg-emerald-900" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
