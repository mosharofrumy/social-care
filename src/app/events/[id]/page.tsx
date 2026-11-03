"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  LogIn,
  MapPin,
  Mail,
  Pencil,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

import { API_BASE_URL, formatEventDate, todayISO } from "@/lib/api";
import type { EventItem, EventLoadState } from "@/types";
import { authClient } from "@/lib/auth-client";
import EditEventDialog from "@/components/events/EditEventDialog";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [event, setEvent] = React.useState<EventItem | null>(null);
  const [state, setState] = React.useState<EventLoadState>("loading");
  const [reloadKey, setReloadKey] = React.useState(0);
  const [joinPending, setJoinPending] = React.useState(false);
  const [deletePending, setDeletePending] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = params?.id;
    if (!id) return;

    let cancelled = false;

    async function loadEvent() {
      try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);

        if (response.status === 404) {
          if (!cancelled) setState("notfound");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch the event");
        }

        const data = (await response.json()) as EventItem;
        if (!cancelled) {
          setEvent(data);
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [params, reloadKey]);

  // Retrying from a click handler is fine (not an effect).
  function handleRetry() {
    setState("loading");
    setReloadKey((key) => key + 1);
  }

  const isOrganizer =
    !!user &&
    !!event &&
    (event.organizerEmail ?? "").trim().toLowerCase() ===
      user.email.trim().toLowerCase();

  const isJoined =
    !!user &&
    !!event &&
    (event.participants ?? []).some(
      (participant) =>
        participant.trim().toLowerCase() === user.email.trim().toLowerCase()
    );

  const isUpcoming = !!event && event.date >= todayISO();
  const joinedCount = event?.participants?.length ?? 0;

  async function toggleJoin() {
    if (!user || !event) return;

    setActionError(null);
    setJoinPending(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${event._id}/${isJoined ? "leave" : "join"}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error((await response.text()) || "Action failed");
      }

      const data = await response.json();
      setEvent({ ...event, participants: data.participants ?? [] });
      toast.success(
        isJoined
          ? `You left "${event.title}".`
          : `You joined "${event.title}".`
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setJoinPending(false);
    }
  }

  async function handleDelete() {
    if (!user || !event) return;

    const confirmed = window.confirm(
      "Delete this event permanently? This action cannot be undone."
    );
    if (!confirmed) return;

    setActionError(null);
    setDeletePending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/events/${event._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to delete");
      }

      toast.success(`"${event.title}" has been deleted.`);
      router.replace("/events");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setDeletePending(false);
    }
  }

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Link>

        {state === "loading" && (
          <div className="mt-6 animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="h-64 rounded-t-3xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4 p-8">
              <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-7 w-2/3 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-5/6 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <p className="font-bold text-rose-700 dark:text-rose-400">
              Could not load this event.
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

        {state === "notfound" && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Event not found
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              This event may have been removed or the link is incorrect.
            </p>
          </div>
        )}

        {state === "ready" && event && (
          <article className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-emerald-900/5 dark:border-gray-800 dark:bg-gray-900">
            {/* Thumbnail */}
            <div className="relative h-64 sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.thumbnailUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />

              <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-900 shadow-sm dark:bg-gray-950/90 dark:text-white">
                {event.badge}
              </span>

              <span className="absolute right-4 bottom-4 rounded-full bg-gray-950/70 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                {event.type}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-10">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {event.title}
              </h1>

              {/* Facts */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                  <CalendarDays
                    size={20}
                    className="shrink-0 text-[#176B50] dark:text-emerald-400"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {formatEventDate(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                  <MapPin
                    size={20}
                    className="shrink-0 text-[#176B50] dark:text-emerald-400"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {event.location || "To be announced"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                  <Users
                    size={20}
                    className="shrink-0 text-[#176B50] dark:text-emerald-400"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Volunteers
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {joinedCount > 0 ? `${joinedCount} joined` : "Open to all"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-gray-600 dark:text-gray-400 sm:text-base">
                {event.description}
              </p>

              {actionError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                >
                  {actionError}
                </p>
              )}

              {/* Organizer: Manage actions */}
              {isOrganizer ? (
                <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <p className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    <UserCheck size={16} />
                    You are the organizer of this event
                  </p>
                  <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                    {joinedCount} volunteer{joinedCount === 1 ? "" : "s"} joined
                    your event.
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setEditOpen(true)}
                      className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#176B50] px-5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
                    >
                      <Pencil size={16} />
                      Edit / Update Event
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deletePending}
                      className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-50 px-5 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-600 hover:text-white dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                    >
                      <Trash2 size={16} />
                      {deletePending ? "Deleting..." : "Delete Event"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Everyone else: Join / Leave + Contact */
                <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-[#176B50] dark:bg-emerald-950 dark:text-emerald-400">
                      {(event.organizerName ?? "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {event.organizerName || "Social Care Team"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Organizer
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Join / Leave */}
                    {sessionPending ? (
                      <div className="h-11 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                    ) : user ? (
                      <button
                        type="button"
                        onClick={toggleJoin}
                        disabled={joinPending || (!isJoined && !isUpcoming)}
                        title={
                          !isJoined && !isUpcoming
                            ? "This event has already taken place"
                            : undefined
                        }
                        className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold shadow-md transition-all duration-200 hover:shadow-lg ${
                          isJoined
                            ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                            : "bg-[#176B50] text-white shadow-emerald-900/10 hover:bg-[#12543E]"
                        } ${joinPending || (!isJoined && !isUpcoming) ? "opacity-60" : ""}`}
                      >
                        <CalendarPlus size={16} />
                        {joinPending
                          ? "Please wait..."
                          : isJoined
                            ? "Leave Event"
                            : isUpcoming
                              ? "Join This Event"
                              : "Event Ended"}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
                      >
                        <LogIn size={16} />
                        Sign In to Join
                      </Link>
                    )}

                    {/* Contact Organizer */}
                    <a
                      href={
                        event.organizerEmail
                          ? `mailto:${event.organizerEmail}`
                          : "mailto:socialcare@info.com"
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
                    >
                      <Mail size={16} />
                      Contact Organizer
                    </a>
                  </div>
                </div>
              )}
            </div>
          </article>
        )}

        {/* Organizer edit modal (shadcn dialog) */}
        {event && (
          <EditEventDialog
            event={event}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSaved={(updated) => setEvent(updated)}
          />
        )}
      </div>
    </main>
  );
}
