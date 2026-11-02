"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventForm from "@/components/events/EventForm";
import { API_BASE_URL } from "@/lib/api";
import type { EventFormPayload } from "@/types";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [publishing, setPublishing] = React.useState(false);
  const [requestError, setRequestError] = React.useState<string | null>(null);
  const [publishedTitle, setPublishedTitle] = React.useState<string | null>(
    null
  );

  // Only signed-in organisers can create events.
  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  async function handlePublish(payload: EventFormPayload) {
    setRequestError(null);
    setPublishing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          organizerName: user?.name ?? "",
          organizerEmail: user?.email ?? "",
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "The server rejected the event. Please try again."
        );
      }

      setPublishedTitle(payload.title);
      toast.success(`"${payload.title}" has been published.`);
    } catch (err) {
      setRequestError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server. Is the Social Care API running?"
      );
    } finally {
      setPublishing(false);
    }
  }

  // Success view
  if (publishedTitle) {
    return (
      <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
        <Card className="mx-auto w-full max-w-md gap-6 rounded-3xl px-6 py-10 text-center shadow-xl shadow-emerald-900/5 sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">
            <Check size={32} className="text-[#176B50] dark:text-emerald-400" />
          </div>

          <CardTitle className="text-3xl font-black tracking-tight">
            Event Published!
          </CardTitle>

          <CardDescription>
            &ldquo;{publishedTitle}&rdquo; is now live on the events page.
          </CardDescription>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/events"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#176B50] px-6 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              View Events
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPublishedTitle(null)}
              className="h-12 rounded-xl border-gray-200 bg-white px-6 text-sm font-bold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
            >
              Create Another
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <Card className="mx-auto w-full max-w-2xl gap-6 rounded-3xl px-6 py-10 shadow-xl shadow-emerald-900/5 sm:px-10">
        {/* Heading */}
        <CardHeader className="justify-items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-emerald-800/30">
            <Image
              src="/sc-logo.png"
              alt="Social Care Logo"
              width={64}
              height={64}
              priority
              className="h-full w-full scale-105 object-cover"
            />
          </div>

          <CardTitle className="mt-2 text-3xl font-black tracking-tight">
            Create Event
          </CardTitle>

          <CardDescription>
            Publish an event so volunteers across the community can join you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <EventForm
            submitting={publishing}
            requestError={requestError}
            submitLabel="Publish Event"
            submittingLabel="Publishing..."
            onSubmit={handlePublish}
          />
        </CardContent>
      </Card>
    </main>
  );
}
