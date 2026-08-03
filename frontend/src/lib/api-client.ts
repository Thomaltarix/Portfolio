// Runtime value (set by public/config.js at container startup) wins over the
// build-time one, so a deployed container's API URL can change without a
// rebuild — see claude/architecture.md. Falls back to the build-time value
// for local dev, where config.js ships an empty placeholder.
//
// Trailing slashes are stripped: every call site passes a leading-slash path
// (apiFetch('/projects')), so a base URL ending in "/" would otherwise
// produce a double slash.
const API_BASE_URL = (
  window.__APP_CONFIG__?.apiBaseUrl || (import.meta.env.VITE_API_BASE_URL as string)
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
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.message ?? `Request to ${path} failed`);
  }

  return response.json() as Promise<T>;
}
