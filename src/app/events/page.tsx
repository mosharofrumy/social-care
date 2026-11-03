"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plus,
  Pencil,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { API_BASE_URL, formatEventDate } from "@/lib/api";
import { useTodayISO } from "@/hooks/use-today-iso";
import { EVENT_TYPES, type EventItem, type AsyncStatus } from "@/types";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const eventTypeFilters = Array.from(
  new Set(
    EVENT_TYPES.map((type) =>
      type.startsWith("Emergency:") ? "Emergency" : type
    )
  )
);

export default function EventsPage() {
  const { data: session } = authClient.useSession();
  const today = useTodayISO();
  const myEmail = (session?.user?.email ?? "").trim().toLowerCase();
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [state, setState] = React.useState<AsyncStatus>("loading");
  const [reloadKey, setReloadKey] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("All");

  React.useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = (await response.json()) as EventItem[];
        if (!cancelled) {
          setEvents(data);
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Retrying from a click handler is fine (not an effect).
  function handleRetry() {
    setState("loading");
    setReloadKey((key) => key + 1);
  }

  const normalizedSearch = search.trim().toLowerCase();
  const upcomingEvents = events.filter((event) => event.date >= today);
  const visibleEvents = upcomingEvents.filter((event) => {
    const matchesType =
      selectedType === "All" ||
      (selectedType === "Emergency"
        ? event.type.startsWith("Emergency:")
        : event.type === selectedType);
    const matchesSearch =
      [
        event.title,
        event.type,
        event.description,
        event.location ?? "",
        event.organizerName ?? "",
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    return matchesType && matchesSearch;
  });

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            What&apos;s Happening
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Upcoming Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Join hands with your community — explore upcoming events,
            pick the causes you care about, and make a difference together.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events by title, type, or location"
              aria-label="Search events"
              className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetry}
              disabled={state === "loading"}
              aria-label="Refresh events"
              className="h-12 rounded-xl border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <RefreshCw
                size={16}
                className={state === "loading" ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter events by type"
          className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-gray-200 pb-4 dark:border-gray-800"
        >
          {["All", ...eventTypeFilters].map((type) => {
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedType(type)}
                className={`cursor-pointer py-1 text-sm font-bold transition-colors ${
                  isSelected
                    ? "text-emerald-700 underline decoration-2 underline-offset-8 dark:text-emerald-400"
                    : "text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {state === "loading" && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="h-44 rounded-t-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-10 w-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {state === "error" && (
          <div className="mt-12 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <p className="font-bold text-rose-700 dark:text-rose-400">
              Could not load events.
            </p>
            <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-400/70">
              Please try again in a moment.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-6 text-sm font-bold text-white transition-colors hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {state === "ready" && upcomingEvents.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">
              <Plus size={26} className="text-[#176B50] dark:text-emerald-400" />
            </div>
            <h2 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
              No upcoming events
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              Be the first to bring the community together — publish an event
              in a couple of minutes.
            </p>
            <Link
              href="/events/create"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#176B50] px-6 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              Create Event
            </Link>
          </div>
        )}

        {state === "ready" &&
          upcomingEvents.length > 0 &&
          visibleEvents.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                No matching events
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
                Try a different search term.
              </p>
            </div>
          )}

        {state === "ready" && visibleEvents.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                canManage={
                  !!myEmail &&
                  (event.organizerEmail ?? "").trim().toLowerCase() === myEmail
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EventCard({
  event,
  canManage,
}: {
  event: EventItem;
  canManage: boolean;
}) {
  const isUrgent = event.badge === "Urgent";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 dark:border-gray-800 dark:bg-gray-900">
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
            isUrgent
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
        <h2 className="line-clamp-2 text-lg font-extrabold text-gray-900 dark:text-white">
          {event.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {event.description}
        </p>

        <div className="mt-3 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center gap-2">
            <CalendarDays size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            {formatEventDate(event.date)}
          </p>

          {event.location && (
            <p className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              {event.location}
            </p>
          )}

          {event.volunteersNeeded != null && event.volunteersNeeded > 0 && (
            <p className="flex items-center gap-2">
              <Users size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              {event.volunteersNeeded} volunteers needed
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3">
          <Link
            href={`/events/${event._id}`}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg ${
              canManage ? "flex-1" : "w-full"
            }`}
          >
            View Details
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          {canManage && (
            <Link
              href={`/events/${event._id}/edit`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <Pencil size={15} />
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
