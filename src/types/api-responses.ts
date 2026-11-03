

import type { EventItem } from "./event";
export interface CreateEventResponse {
  message: string;
  insertedId: string;
  event: EventItem;
}

export interface UpdateEventResponse {
  message: string;
  event: EventItem;
}

export interface DeleteEventResponse {
  message: string;
}

export interface ParticipantResponse {
  message: string;
  participants: string[];
}
