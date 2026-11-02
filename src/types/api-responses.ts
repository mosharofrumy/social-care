/**
 * Typed response shapes returned by the Social Care Express API.
 */

import type { EventItem } from "./event";

/** Successful event creation (POST /events). */
export interface CreateEventResponse {
  message: string;
  insertedId: string;
  event: EventItem;
}

/** Successful update (PUT /events/:id). */
export interface UpdateEventResponse {
  message: string;
  event: EventItem;
}

/** Successful delete (DELETE /events/:id). */
export interface DeleteEventResponse {
  message: string;
}

/** Successful join/leave (POST /events/:id/join | /leave). */
export interface ParticipantResponse {
  message: string;
  participants: string[];
}
