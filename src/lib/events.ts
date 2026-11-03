import { ObjectId, type WithId } from "mongodb";

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

export async function getCurrentUser(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization !== null) {
    const bearerToken = /^Bearer\s+(\S+)$/i.exec(authorization)?.[1];
    if (!bearerToken) return null;

    const { payload } = await auth.api.verifyJWT({
      body: { token: bearerToken },
    });
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

  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

export function isEventPayload(value: unknown): value is EventFormPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  const date =
    typeof payload.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(payload.date) &&
    !Number.isNaN(Date.parse(`${payload.date}T00:00:00.000Z`)) &&
    new Date(`${payload.date}T00:00:00.000Z`).toISOString().slice(0, 10) ===
      payload.date;

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
    date &&
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
