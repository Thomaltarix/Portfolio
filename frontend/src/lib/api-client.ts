// Runtime value (set by public/config.js at container startup) wins over the
// build-time one, so a deployed container's API URL can change without a
// rebuild — see claude/architecture.md. Falls back to the build-time value
// for local dev, where config.js ships an empty placeholder.
//
// Trailing slashes are stripped: every call site passes a leading-slash path
// (apiFetch('/projects')), so a base URL ending in "/" would otherwise
// produce a double slash.
const API_BASE_URL = (
  window.__APP_CONFIG__?.apiBaseUrl || (import.meta.env.VITE_API_BASE_URL as string | undefined) || ''
).replace(/\/+$/, '');

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    // Lets the admin session cookie round-trip to api.<domain> — harmless for
    // anonymous requests, since there's no cookie to send until logged in.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.message ?? `Request to ${path} failed`);
  }

  // 204 (and any other empty body) has nothing for response.json() to parse —
  // several admin endpoints (delete, analytics tracking) return exactly this.
  if (response.status === HTTP_NO_CONTENT) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const HTTP_NO_CONTENT = 204;
