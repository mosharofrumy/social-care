/**
 * Async UI loading states shared across pages and hooks.
 */

/** Shared status for client-side data loading (lists, hooks). */
export type AsyncStatus = "loading" | "ready" | "error";

/** Status used by detail pages, which additionally handle "not found". */
export type EventLoadState = AsyncStatus | "notfound";
