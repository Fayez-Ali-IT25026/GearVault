import { authClient } from "@/lib/auth-client";

// Cache the JWT token for 5 minutes to avoid fetching it on every request.
let cachedToken: string | null = null;
let cachedAt: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

export async function getToken(): Promise<string | null> {
  // Return cached token if still valid
  if (cachedToken && Date.now() - cachedAt < CACHE_TTL) {
    return cachedToken;
  }

  try {
    const { data } = await authClient.token();
    if (data?.token) {
      cachedToken = data.token;
      cachedAt = Date.now();
      return cachedToken;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearToken(): void {
  cachedToken = null;
  cachedAt = 0;
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getToken();

  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
}