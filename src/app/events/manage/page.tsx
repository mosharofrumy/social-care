"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditEventDialog from "@/components/events/EditEventDialog";
import { authClient } from "@/lib/auth-client";
import { useEvents } from "@/hooks/use-events";
import {
  API_BASE_URL,
  formatEventDate,
  normalizeEmail,
  todayISO,
} from "@/lib/api";
import type { EventItem } from "@/types";
import { toast } from "sonner";

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user ?? null;

  const { events, status, retry } = useEvents();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<EventItem | null>(
    null
  );
  const [editTarget, setEditTarget] = React.useState<EventItem | null>(
    null
  );

  // Only signed-in organizers can manage events.
  React.useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login");
    }
  }, [sessionPending, user, router]);

  // Upcoming events first (closest date first), past events afterwards.
  const myEmail = normalizeEmail(user?.email);
  const myEvents = events
    .filter((event) => normalizeEmail(event.organizerEmail) === myEmail)
    .sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = myEvents.filter((event) => event.date >= todayISO());
  const past = myEvents.filter((event) => event.date < todayISO());
  const ordered = [...upcoming, ...past];
  const volunteersJoined = myEvents.reduce(
    (total, event) => total + (event.participants?.length ?? 0),
    0
  );

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleteError(null);
    setDeletingId(deleteTarget._id);

    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${deleteTarget._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          (await response.text()) || "Failed to delete the event."
        );
      }

      // Refetch the list so Mongo and the UI stay in sync.
      retry();
      setDeleteTarget(null);
      toast.success(`"${deleteTarget.title}" has been deleted.`);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const isLoading = sessionPending || status === "loading";

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Organizer Tools
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Manage Events
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Update or remove the events you have published and keep an eye
            on how many volunteers joined.
          </p>
        </div>

        {/* Stat tiles */}
        {!isLoading && status !== "error" && myEvents.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {myEvents.length}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Events Published
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {upcoming.length}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Upcoming
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {volunteersJoined}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Volunteers Joined
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-10 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="h-20 w-32 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/3 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-36 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {status === "error" && !isLoading && (
          <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <p className="font-bold text-rose-700 dark:text-rose-400">
              Could not load your events.
            </p>
            <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-400/70">
              Please try again in a moment.
            </p>

            <Button
              type="button"
              onClick={retry}
              className="mt-5 h-11 rounded-xl bg-rose-600 px-6 text-sm font-bold text-white hover:bg-rose-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty */}
        {status === "ready" && myEvents.length === 0 && !isLoading && (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">
              <Plus
                size={26}
                className="text-[#176B50] dark:text-emerald-400"
              />
            </div>
            <h2 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
              You haven&apos;t published any events yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              Create your first event and it will show up here for you to
              manage.
            </p>
            <Link
              href="/events/create"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-6 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              <Plus size={16} />
              Create Event
            </Link>
          </div>
        )}

        {/* Event list */}
        {status === "ready" && ordered.length > 0 && !isLoading && (
          <div className="mt-10 space-y-4">
            {ordered.map((event) => {
              const isUpcoming = event.date >= todayISO();
              const joined = event.participants?.length ?? 0;

              return (
                <div
                  key={event._id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg hover:shadow-emerald-900/5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row"
                >
                  {/* Thumbnail */}
                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.thumbnailUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="line-clamp-1 text-base font-extrabold text-gray-900 dark:text-white">
                        {event.title}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          isUpcoming
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Past"}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {formatEventDate(event.date)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {event.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Users size={13} />
                        {joined} joined
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2 self-stretch sm:self-center">
                    <Link
                      href={`/events/${event._id}`}
                      title="View event details"
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800 sm:flex-none"
                    >
                      View Details
                    </Link>

                    <Button
                      type="button"
                      onClick={() => setEditTarget(event)}
                      title="Edit this event"
                      className="h-10 flex-1 gap-2 rounded-xl bg-[#176B50] px-4 text-xs font-extrabold text-white transition-colors hover:bg-[#12543E] sm:flex-none"
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={deletingId === event._id}
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteTarget(event);
                      }}
                      title="Delete this event"
                      className="h-10 flex-1 gap-2 rounded-xl border-rose-200 bg-white px-4 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white dark:border-rose-900/50 dark:bg-transparent dark:text-rose-400 dark:hover:bg-rose-600 sm:flex-none"
                    >
                      <RefreshCw
                        size={14}
                        className={
                          deletingId === event._id ? "animate-spin" : "hidden"
                        }
                      />
                      <Trash2
                        size={14}
                        className={
                          deletingId === event._id ? "hidden" : undefined
                        }
                      />
                      {deletingId === event._id ? "Deleting" : "Delete"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit modal (shadcn dialog + shared EventForm) */}
        {editTarget && (
          <EditEventDialog
            event={editTarget}
            open
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                setEditTarget(null);
              }
            }}
            onSaved={() => retry()}
          />
        )}

        {deleteTarget && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open && !deletingId) {
                setDeleteTarget(null);
                setDeleteError(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete event?</DialogTitle>
                <DialogDescription>
                  Delete &ldquo;{deleteTarget.title}&rdquo; permanently? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              {deleteError && (
                <p
                  role="alert"
                  className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                >
                  {deleteError}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={deletingId === deleteTarget._id}
                  onClick={() => {
                    setDeleteTarget(null);
                    setDeleteError(null);
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={deletingId === deleteTarget._id}
                  onClick={handleDelete}
                  className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                >
                  {deletingId === deleteTarget._id
                    ? "Deleting..."
                    : "Delete Event"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </main>
  );
}
