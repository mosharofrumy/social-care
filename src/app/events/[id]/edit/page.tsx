"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/components/events/EventForm";
import { API_BASE_URL } from "@/lib/api";
import { authenticatedFetch } from "@/lib/authenticated-fetch";
import type { EventFormPayload, EventItem, EventLoadState } from "@/types";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [event, setEvent] = React.useState<EventItem | null>(null);
  const [state, setState] = React.useState<EventLoadState>("loading");
  const [reloadKey, setReloadKey] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [requestError, setRequestError] = React.useState<string | null>(null);

  // Signed-out users can't manage events.
  React.useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login");
    }
  }, [sessionPending, user, router]);

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

  function handleRetry() {
    setState("loading");
    setReloadKey((key) => key + 1);
  }

  const isOrganizer =
    !!user &&
    !!event &&
    (event.organizerEmail ?? "").trim().toLowerCase() ===
      user.email.trim().toLowerCase();

  async function handleSave(payload: EventFormPayload) {
    if (!event) return;

    setRequestError(null);
    setSaving(true);

    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/events/${event._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          (await response.text()) || "Failed to update the event."
        );
      }

      // The server only accepts updates from the organizer.
      toast.success(`"${payload.title}" has been updated.`);
      router.replace(`/events/${event._id}`);
    } catch (err) {
      setRequestError(
        err instanceof Error
          ? err.message
          : "Could not connect to the event service."
      );
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        {/* Back */}
        <Link
          href={`/events/${params?.id ?? ""}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <ArrowLeft size={16} />
          Back to Event
        </Link>

        {(sessionPending || state === "loading") && (
          <div className="mt-6 animate-pulse space-y-4 rounded-3xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="h-7 w-1/3 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-12 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-12 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-32 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
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

            <Button
              type="button"
              onClick={handleRetry}
              className="mt-5 h-11 rounded-xl bg-rose-600 px-6 text-sm font-bold text-white hover:bg-rose-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {state === "notfound" && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Event not found
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              This event may have been deleted or the link is incorrect.
            </p>
          </div>
        )}

        {state === "ready" && event && !isOrganizer && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950">
              <ShieldAlert
                size={26}
                className="text-amber-700 dark:text-amber-400"
              />
            </div>
            <h2 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
              Only the organizer can manage this event
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-amber-800/80 dark:text-amber-400/80">
              You can still view all the details of this event from the events
              page.
            </p>

            <Link
              href={`/events/${event._id}`}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#176B50] px-6 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              View Event Details
            </Link>
          </div>
        )}

        {state === "ready" && event && isOrganizer && (
          <Card className="mt-6 gap-6 rounded-3xl px-6 py-10 shadow-xl shadow-emerald-900/5 sm:px-10">
            <CardHeader>
              <CardTitle className="text-3xl font-black tracking-tight">
                Edit Event
              </CardTitle>
              <CardDescription>
                Update &ldquo;{event.title}&rdquo; — changes go live
                immediately after saving.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* key remounts the form once the event data is loaded */}
              <EventForm
                key={event._id + (event.title ?? "") + (event.date ?? "")}
                initialValues={event}
                submitting={saving}
                requestError={requestError}
                submitLabel="Save Changes"
                submittingLabel="Saving Changes..."
                onSubmit={handleSave}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
