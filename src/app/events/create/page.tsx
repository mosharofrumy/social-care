"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import type { EventFormPayload } from "@/types";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [publishing, setPublishing] = React.useState(false);
  const [requestError, setRequestError] = React.useState<string | null>(null);
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
      const response = await authenticatedFetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "The server rejected the event. Please try again."
        );
      }

      toast.success(`"${payload.title}" has been published.`);
      router.replace("/events");
    } catch (err) {
      setRequestError(
        err instanceof Error
          ? err.message
          : "Could not connect to the event service."
      );
    } finally {
      setPublishing(false);
    }
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
