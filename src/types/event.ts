/**
 * Event domain types and constants.
 *
 * This module is the single source of truth for everything that
 * describes an event: the selectable dropdown values, the Mongo
 * document shape, the validated form payload, and per-field errors.
 */

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/** All selectable event types shown in dropdowns (min. 10 required). */
export const EVENT_TYPES = [
  "Donation Drive",
  "Health Campaign",
  "Education Support",
  "Plantation",
  "Child Care",
  "Clean-Up Drive",
  "Relief Support",
  "Emergency: Flood",
  "Emergency: Cyclone",
  "Emergency: Earthquake",
  "Emergency: Fire",
  "Blood Donation",
  "Food Distribution",
  "Elder Support",
  "Animal Welfare",
  "Winter Clothing Drive",
  "Women Empowerment",
  "Sports & Community",
] as const;

/** Card badges an event can carry. */
export const EVENT_BADGES = ["New", "Urgent", "Featured", "Ongoing"] as const;

/** Union of every valid event type. */
export type EventTypeValue = (typeof EVENT_TYPES)[number];

/** Union of every valid event badge. */
export type EventBadge = (typeof EVENT_BADGES)[number];

/* ------------------------------------------------------------------ */
/* Event shapes                                                        */
/* ------------------------------------------------------------------ */

/** One event document as stored in the MongoDB `socialcare.events` collection. */
export interface EventItem {
  _id: string;
  title: string;
  type: EventTypeValue;
  badge: EventBadge;
  /** Event date as a local ISO day, `YYYY-MM-DD`. */
  date: string;
  thumbnailUrl: string;
  description: string;
  location?: string;
  /** Requested number of volunteers. */
  volunteersNeeded?: number;
  organizerName?: string;
  /** Better Auth user email of the organizer (owner/manager of the event). */
  organizerEmail?: string;
  /** Emails of users who joined the event. */
  participants?: string[];
  createdAt?: string;
}

/**
 * The validated, trimmed payload produced by the shared EventForm —
 * consumed by the create (POST) and edit (PUT) pages.
 */
export interface EventFormPayload {
  title: string;
  type: EventTypeValue;
  badge: EventBadge;
  date: string;
  thumbnailUrl: string;
  description: string;
  location: string;
  volunteersNeeded: number;
}

/** Per-field validation errors produced by the shared EventForm. */
export type EventFieldErrors = Partial<
  Record<
    | "badge"
    | "title"
    | "type"
    | "date"
    | "thumbnailUrl"
    | "volunteersNeeded"
    | "description",
    string
  >
>;

/** Today's local ISO day (`YYYY-MM-DD`) — event dates must be >= this. */
export type ISODate = `${number}-${number}-${number}`;

/** Props of the shared create/edit event form. */
export interface EventFormProps {
  /** Pre-fills the form (used by the edit dialog/page). */
  initialValues?: Partial<EventFormPayload>;
  submitting: boolean;
  requestError: string | null;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (payload: EventFormPayload) => void;
}

/** Props of the shadcn-edit-modal for updating an event (organizer only). */
export interface EditEventDialogProps {
  /** The event being edited (prefills the form). */
  event: EventItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the updated event after a successful PUT. */
  onSaved?: (updated: EventItem) => void;
}
