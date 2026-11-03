import { ObjectId, type WithId } from "mongodb";

import { todayISO } from "@/lib/api";
import { auth, db } from "@/lib/auth";
import type { EventFormPayload, EventItem } from "@/types";

type EventDocument = Omit<EventItem, "_id"> & { _id?: ObjectId };

export const eventsCollection = db.collection<EventDocument>("events");

export function parseEventId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? new ObjectId(value) : null;
}

export function serializeEvent(event: WithId<EventDocument>): EventItem {
  return { ...event, _id: event._id.toHexString() };
}

export function getTodayDate() {
  return todayISO();
}

export function isValidEventDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value &&
    value >= getTodayDate()
  );
}

export async function getCurrentUser(request: Request) {
  const authorization = request.headers.get("authorization");
  const bearerToken = /^Bearer\s+(\S+)$/i.exec(authorization ?? "")?.[1];
  if (!bearerToken) return null;

  let payload: { sub?: string } | null;
  try {
    ({ payload } = await auth.api.verifyJWT({
      body: { token: bearerToken },
    }));
  } catch {
    return null;
  }
  if (!payload?.sub) return null;

  const context = await auth.$context;
  return context.adapter.findOne<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }>({
    model: "user",
    where: [{ field: "id", value: payload.sub }],
  });
}

export function isEventPayload(value: unknown): value is EventFormPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  let validThumbnail = false;
  if (typeof payload.thumbnailUrl === "string") {
    try {
      const url = new URL(payload.thumbnailUrl);
      validThumbnail = url.protocol === "http:" || url.protocol === "https:";
    } catch {
      validThumbnail = false;
    }
  }

  return (
    typeof payload.title === "string" &&
    payload.title.trim().length >= 3 &&
    typeof payload.type === "string" &&
    typeof payload.badge === "string" &&
    isValidEventDate(payload.date) &&
    validThumbnail &&
    typeof payload.description === "string" &&
    payload.description.trim().length >= 10 &&
    typeof payload.location === "string" &&
    typeof payload.volunteersNeeded === "number" &&
    Number.isSafeInteger(payload.volunteersNeeded) &&
    payload.volunteersNeeded >= 0
  );
}

export function isEventOwner(
  event: Pick<EventItem, "organizerEmail">,
  email: string
) {
  return event.organizerEmail?.trim().toLowerCase() === email.trim().toLowerCase();
}
