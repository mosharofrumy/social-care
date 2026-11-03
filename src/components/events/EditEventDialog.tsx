"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "@/components/events/EventForm";
import { API_BASE_URL } from "@/lib/api";
import { authenticatedFetch } from "@/lib/authenticated-fetch";
import type {
  EditEventDialogProps,
  EventFormPayload,
  UpdateEventResponse,
} from "@/types";
import { toast } from "sonner";

/**
 * Edit-event modal built on the shadcn dialog.
 * Prefills the shared EventForm and saves via PUT /events/:id — the
 * server only accepts updates from the event's organizer.
 */
export default function EditEventDialog({
  event,
  open,
  onOpenChange,
  onSaved,
}: EditEventDialogProps) {
  const [saving, setSaving] = React.useState(false);
  const [requestError, setRequestError] = React.useState<string | null>(null);

  async function handleSave(payload: EventFormPayload) {
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

      const data = (await response.json()) as UpdateEventResponse;

      onSaved?.(data.event);
      toast.success(`"${data.event.title}" has been updated.`);
      onOpenChange(false);
    } catch (err) {
      setRequestError(
        err instanceof Error
          ? err.message
          : "Could not connect to the event service."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="pr-8">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update &ldquo;{event.title}&rdquo; — changes go live immediately
            after saving.
          </DialogDescription>
        </DialogHeader>

        {/* key remounts the form each time the modal opens */}
        <EventForm
          key={event._id}
          initialValues={event}
          submitting={saving}
          requestError={requestError}
          submitLabel="Save Changes"
          submittingLabel="Saving Changes..."
          onSubmit={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
