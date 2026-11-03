import { EVENT_BADGES, EVENT_TYPES } from "@/types";
import {
  eventsCollection,
  getCurrentUser,
  isEventOwner,
  isEventPayload,
  parseEventId,
  serializeEvent,
} from "@/lib/events";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const objectId = parseEventId(id);
  if (!objectId) return new Response("Event not found.", { status: 404 });

  const event = await eventsCollection.findOne({ _id: objectId });
  if (!event) return new Response("Event not found.", { status: 404 });

  return Response.json(serializeEvent(event));
}

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getCurrentUser(request);
  if (!user) return new Response("Authentication required.", { status: 401 });

  const { id } = await params;
  const objectId = parseEventId(id);
  if (!objectId) return new Response("Event not found.", { status: 404 });

  const existing = await eventsCollection.findOne({ _id: objectId });
  if (!existing) return new Response("Event not found.", { status: 404 });
  if (!isEventOwner(existing, user.email)) {
    return new Response("Only the event organizer can update it.", {
      status: 403,
    });
  }

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

  await eventsCollection.updateOne(
    { _id: objectId },
    {
      $set: {
        ...body,
        title: body.title.trim(),
        description: body.description.trim(),
        location: body.location.trim(),
      },
    }
  );
  const event = await eventsCollection.findOne({ _id: objectId });

  if (!event) return new Response("Event not found.", { status: 404 });
  return Response.json({
    message: "Event updated successfully.",
    event: serializeEvent(event),
  });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getCurrentUser(request);
  if (!user) return new Response("Authentication required.", { status: 401 });

  const { id } = await params;
  const objectId = parseEventId(id);
  if (!objectId) return new Response("Event not found.", { status: 404 });

  const existing = await eventsCollection.findOne({ _id: objectId });
  if (!existing) return new Response("Event not found.", { status: 404 });
  if (!isEventOwner(existing, user.email)) {
    return new Response("Only the event organizer can delete it.", {
      status: 403,
    });
  }

  await eventsCollection.deleteOne({ _id: objectId });
  return Response.json({ message: "Event deleted successfully." });
}
