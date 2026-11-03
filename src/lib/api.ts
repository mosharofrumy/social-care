/**
 * API configuration and client-side helpers.
 * All project types live in the `src/types` folder (import via `@/types`).
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/** Local today as YYYY-MM-DD (timezone-safe). */
export function todayISO() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

/** Friendly date, e.g. "Monday, December 7, 2026". */
export function formatEventDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Case-insensitive email key used for organizer/participant checks. */
export function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}
