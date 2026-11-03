import {
  eventsCollection,
  getTodayDate,
  getCurrentUser,
  parseEventId,
} from "@/lib/events";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const user = await getCurrentUser(request);
  if (!user) return new Response("Authentication required.", { status: 401 });

  const { id } = await params;
  const objectId = parseEventId(id);
  if (!objectId) return new Response("Event not found.", { status: 404 });

  const eventToJoin = await eventsCollection.findOne({ _id: objectId });
  if (!eventToJoin) return new Response("Event not found.", { status: 404 });
  if (eventToJoin.date < getTodayDate()) {
    return new Response("Past events cannot be joined.", { status: 400 });
  }

  const email = user.email.trim().toLowerCase();
  const result = await eventsCollection.updateOne(
    { _id: objectId },
    { $addToSet: { participants: email } }
  );
  if (result.matchedCount === 0) {
    return new Response("Event not found.", { status: 404 });
  }

  const event = await eventsCollection.findOne({ _id: objectId });
  if (!event) return new Response("Event not found.", { status: 404 });
  return Response.json({
    message: "Joined event successfully.",
    participants: event.participants ?? [],
  });
}
