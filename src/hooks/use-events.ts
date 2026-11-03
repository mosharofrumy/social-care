"use client";

import * as React from "react";

import { API_BASE_URL } from "@/lib/api";
import type { AsyncStatus, EventItem } from "@/types";

/**
 * Fetches all events from this app's event API.
 * All setState calls happen in async continuations (never synchronously
 * inside the effect body), which the React Compiler rules require.
 */
export function useEvents() {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [status, setStatus] = React.useState<AsyncStatus>("loading");
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = (await response.json()) as EventItem[];
        if (!cancelled) {
          setEvents(data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Retrying from a click handler is fine (not an effect).
  function retry() {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  }

  return { events, status, retry };
}
