// Placeholder for local dev and `vite preview` — Vite serves everything in
// public/ as-is, so this loads during `vite dev` too, just with an empty
// apiBaseUrl. In the Docker image, this file is overwritten at container
// startup by docker-entrypoint.d/40-generate-runtime-config.sh with the
// API_BASE_URL the container was actually started with — see
// claude/architecture.md. api-client.ts falls back to VITE_API_BASE_URL
// whenever apiBaseUrl is empty (or this script fails to load at all).
window.__APP_CONFIG__ = {
  apiBaseUrl: '',
};
