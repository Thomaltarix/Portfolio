import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, ApiError } from './api-client';

describe('apiFetch', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the parsed JSON body on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '1' }),
    });

    const result = await apiFetch<{ id: string }>('/projects');

    expect(result).toEqual({ id: '1' });
  });

  it('sends a JSON content-type header by default', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    await apiFetch('/projects');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('throws an ApiError using the response body message on failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Invalid payload' }),
    });

    await expect(apiFetch('/contact')).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Invalid payload',
    });
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    });

    const error = (await apiFetch('/contact').catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(500);
    expect(error.message).toContain('/contact');
  });
});

describe('API_BASE_URL resolution', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    delete window.__APP_CONFIG__;
    fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('prefers the runtime config injected by config.js', async () => {
    window.__APP_CONFIG__ = { apiBaseUrl: 'https://runtime.example.com' };

    const { apiFetch: freshApiFetch } = await import('./api-client');
    await freshApiFetch('/projects');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe('https://runtime.example.com/projects');
  });

  it('falls back to the build-time VITE_API_BASE_URL when no runtime config is present', async () => {
    const { apiFetch: freshApiFetch } = await import('./api-client');
    await freshApiFetch('/projects');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe(`${import.meta.env.VITE_API_BASE_URL}/projects`);
  });
});
