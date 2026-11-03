"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Plus } from "lucide-react";

import { useEvents } from "@/hooks/use-events";
import { authClient } from "@/lib/auth-client";
import { formatEventDate } from "@/lib/api";
import { Pencil } from "lucide-react";

export default function UpcomingEventsSection() {
  const { events: upcoming, status, retry } = useEvents({
    upcomingOnly: true,
  });
  const myEmail = (authClient.useSession().data?.user?.email ?? "")
    .trim()
    .toLowerCase();

  return (
    <section className="bg-white py-16 transition-colors dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            What&apos;s Next
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Upcoming Events
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Explore what the community is planning next — pick a cause
            and be part of the change.
          </p>
        </div>

        {/* Content */}
        {status === "loading" && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="h-44 bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-9 w-28 rounded-xl bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="mt-12 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <p className="font-bold text-rose-700 dark:text-rose-400">
              Could not load events.
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

        {status === "ready" && upcoming.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">
              <Plus size={26} className="text-[#176B50] dark:text-emerald-400" />
            </div>
            <h3 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
              No upcoming events yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              Be the first to bring the community together.
            </p>
            <Link
              href="/events/create"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#176B50] px-6 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              Create Event
            </Link>
          </div>
        )}

        {/* 3x3 Grid */}
        {status === "ready" && upcoming.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <div
                key={event._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <span
                    className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm ${
                      event.badge === "Urgent"
                        ? "bg-rose-600/90 text-white"
                        : "bg-white/90 text-gray-900 dark:bg-gray-950/90 dark:text-white"
                    }`}
                  >
                    {event.badge}
                  </span>

                  {/* Type chip */}
                  <span className="absolute right-3 bottom-3 rounded-full bg-gray-950/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {event.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-lg font-extrabold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>

                  <div className="mt-2 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-emerald-600 dark:text-emerald-400"
                      />
                      {formatEventDate(event.date)}
                    </p>

                    {event.location && (
                      <p className="flex items-center gap-2">
                        <MapPin
                          size={15}
                          className="shrink-0 text-emerald-600 dark:text-emerald-400"
                        />
                        {event.location}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {/* Stretched link: covers the whole card so clicking
                        anywhere opens the details (no nested <a> allowed). */}
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition-colors after:absolute after:inset-0 after:z-10 after:rounded-2xl after:content-[''] group-hover:text-[#176B50] dark:text-emerald-400"
                    >
                      View Details
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                    {/* Sits above the stretched link overlay */}
                    {(event.organizerEmail ?? "")
                      .trim()
                      .toLowerCase() === myEmail &&
                      myEmail && (
                        <Link
                          href="/events/manage"
                          title="Manage this event"
                          className="relative z-20 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
                        >
                          <Pencil size={12} />
                          Manage
                        </Link>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        {status === "ready" && upcoming.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-7 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
