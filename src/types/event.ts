
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


export const EVENT_BADGES = ["New", "Urgent", "Featured", "Ongoing"] as const;
export type EventTypeValue = (typeof EVENT_TYPES)[number];
export type EventBadge = (typeof EVENT_BADGES)[number];

export interface EventItem {
  _id: string;
  title: string;
  type: EventTypeValue;
  badge: EventBadge;
  date: string;
  thumbnailUrl: string;
  description: string;
  location?: string;
  volunteersNeeded?: number;
  organizerName?: string;
  organizerEmail?: string;
  participants?: string[];
  createdAt?: string;
}


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

export type ISODate = `${number}-${number}-${number}`;


export interface EventFormProps {
  initialValues?: Partial<EventFormPayload>;
  submitting: boolean;
  requestError: string | null;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (payload: EventFormPayload) => void;
}

export interface EditEventDialogProps {
  event: EventItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (updated: EventItem) => void;
}
