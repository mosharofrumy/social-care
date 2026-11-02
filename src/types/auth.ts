/**
 * Authentication domain types (Better Auth session shapes).
 */

/** The fields the app uses from a Better Auth session user. */
export interface SessionUser {
  name: string;
  email: string;
  /** Profile photo URL (from registration or GitHub). */
  image?: string | null;
}
