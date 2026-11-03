/**
 * API configuration and client-side helpers.
 * All project types live in the `src/types` folder (import via `@/types`).
 */

export const API_BASE_URL = "/api";

/** Bangladesh's current date as YYYY-MM-DD. */
export function todayISO() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = parts.reduce<Record<string, string>>((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  return `${values.year}-${values.month}-${values.day}`;
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
