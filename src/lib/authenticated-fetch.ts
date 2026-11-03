import { authClient } from "@/lib/auth-client";

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const { data, error } = await authClient.$fetch<{ token: string }>("/token");
  if (error) {
    throw new Error(
      error.message || "Could not retrieve an authentication token.",
    );
  }
  if (!data?.token) {
    throw new Error("Authentication required.");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(input, { ...init, headers });
}
