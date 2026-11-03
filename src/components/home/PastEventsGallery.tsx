"use client";

import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

import { useEvents } from "@/hooks/use-events";
import { todayISO, formatEventDate } from "@/lib/api";

export default function PastEventsGallery() {
  const { events, status, retry } = useEvents();

  // Show past events first; use current event posters when there are no memories yet.
  const pastEvents = events
    .filter((event) => event.date < todayISO())
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((event) => event.thumbnailUrl);
  const showingUpcomingHighlights = pastEvents.length === 0;
  const galleryEvents = (
    showingUpcomingHighlights
      ? [...events].sort((a, b) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
        )
      : pastEvents
  )
    .filter((event) => event.thumbnailUrl)
    .slice(0, 8);

  return (
    <section className="bg-gray-50 py-16 transition-colors dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Community Photos
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Community Event Gallery
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            {showingUpcomingHighlights
              ? "Explore the causes and community events bringing people together."
              : "Moments captured from the events we've recently organized; every photograph is a story of kindness."}
          </p>
        </div>

        {/* Content */}
        {status === "loading" && (
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="mt-12 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <p className="font-bold text-rose-700 dark:text-rose-400">
              Could not load event photos.
            </p>
            <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-400/70">
              Please try again in a moment.
            </p>

            <button
              type="button"
              onClick={retry}
              className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-6 text-sm font-bold text-white transition-colors hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "ready" && galleryEvents.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-950">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">
              <Camera size={26} className="text-[#176B50] dark:text-emerald-400" />
            </div>
            <h3 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
              No event photos yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              Event images will be showcased here once they are added.
            </p>
          </div>
        )}

        {/* Photo Gallery */}
        {status === "ready" && galleryEvents.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {galleryEvents.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.thumbnailUrl}
                  alt={`${event.title} photograph`}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-gray-950/85 via-gray-950/20 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                  <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white self-start">
                    {event.type}
                  </span>
                  <h3 className="mt-2 line-clamp-2 text-sm font-extrabold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-300">
                    {formatEventDate(event.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All */}
        {status === "ready" && galleryEvents.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
            >
              Explore All Events
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
