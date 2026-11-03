import Link from "next/link";
import { ArrowRight, Compass, Heart, MapPin, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center overflow-hidden bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <section className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles aria-hidden="true" size={15} />
            A little detour
          </div>

          <p className="mt-7 text-7xl leading-none font-black tracking-[-0.08em] text-[#176B50] dark:text-emerald-400 sm:text-8xl">
            404
          </p>
          <h1 className="mt-5 text-3xl leading-tight font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
            This page couldn&apos;t be found.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg sm:leading-8 lg:mx-0">
            It may have moved, or the link might be taking you somewhere that
            doesn&apos;t exist. Let&apos;s get you back to the good things
            happening in our community.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12543E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Compass aria-hidden="true" size={18} />
              Back to Social Care
              <ArrowRight
                aria-hidden="true"
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/events"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-[#176B50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
            >
              Explore events
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            Need a hand?{" "}
            <Link
              href="/"
              className="font-semibold text-[#176B50] underline decoration-emerald-300 underline-offset-4 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Start again from home
            </Link>
          </p>
        </section>

        <aside
          aria-label="A heart marking the way back to the community"
          className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center"
        >
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full border border-emerald-200/80 dark:border-emerald-900/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[17%] rounded-full border border-dashed border-emerald-300/80 dark:border-emerald-800"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[27%] rounded-full bg-emerald-100/70 shadow-[0_0_100px_rgba(16,185,129,0.17)] dark:bg-emerald-950/60"
          />

          <div className="absolute left-[12%] top-[25%] flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white text-emerald-700 shadow-lg shadow-emerald-950/10 dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-300">
            <MapPin aria-hidden="true" size={21} />
          </div>
          <div className="absolute bottom-[19%] right-[15%] flex size-11 items-center justify-center rounded-2xl border border-white/80 bg-white text-emerald-700 shadow-lg shadow-emerald-950/10 dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-300">
            <Sparkles aria-hidden="true" size={19} />
          </div>

          <div className="relative flex size-[42%] items-center justify-center rounded-[2rem] bg-[#176B50] text-white shadow-2xl shadow-emerald-950/25 ring-8 ring-white/70 dark:bg-emerald-700 dark:ring-gray-900/70 sm:rounded-[2.5rem]">
            <Heart
              aria-hidden="true"
              className="size-[42%] fill-emerald-300 text-emerald-300"
              strokeWidth={1.5}
            />
            <span className="absolute -right-3 -top-3 flex size-11 items-center justify-center rounded-full border-4 border-gray-50 bg-amber-300 text-emerald-950 shadow-md dark:border-gray-950">
              <Compass aria-hidden="true" size={19} />
            </span>
          </div>

          <div className="absolute bottom-[9%] left-[5%] rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 shadow-xl shadow-emerald-950/10 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              Your community
            </p>
            <p className="mt-1 text-sm font-extrabold text-gray-900 dark:text-white">
              Is just around the corner
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
