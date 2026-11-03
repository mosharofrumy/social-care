import { EVENT_BADGES, EVENT_TYPES } from "@/types";
import {
  eventsCollection,
  getTodayDate,
  getCurrentUser,
  isEventPayload,
  serializeEvent,
} from "@/lib/events";

export async function GET(request: Request) {
  const isHomeQuery =
    new URL(request.url).searchParams.get("view") === "home";
  const query = isHomeQuery ? { date: { $gte: getTodayDate() } } : {};
  const cursor = eventsCollection.find(query).sort({ date: 1 });
  const events = isHomeQuery
    ? await cursor.limit(6).toArray()
    : await cursor.toArray();
  return Response.json(events.map(serializeEvent));
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return new Response("Authentication required.", { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON request body.", { status: 400 });
  }

  if (
    !isEventPayload(body) ||
    !EVENT_TYPES.some((type) => type === body.type) ||
    !EVENT_BADGES.some((badge) => badge === body.badge)
  ) {
    return new Response("Invalid event details.", { status: 400 });
  }

  const event = {
    ...body,
    title: body.title.trim(),
    description: body.description.trim(),
    location: body.location.trim(),
    organizerName: user.name,
    organizerEmail: user.email.trim().toLowerCase(),
    participants: [],
    createdAt: new Date().toISOString(),
  };
  const result = await eventsCollection.insertOne(event);

  return Response.json(
    {
      message: "Event created successfully.",
      insertedId: result.insertedId.toHexString(),
      event: serializeEvent({ ...event, _id: result.insertedId }),
    },
    { status: 201 }
  );
}
