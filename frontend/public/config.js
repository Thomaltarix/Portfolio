// Placeholder for local dev and `vite preview`. In the Docker image, this
// file is overwritten at container startup by docker-entrypoint.sh with the
// API_BASE_URL the container was actually started with — see
// claude/architecture.md. api-client.ts falls back to VITE_API_BASE_URL if
// this script never loads (e.g. `vite dev`, which doesn't serve this build
// output path).
window.__APP_CONFIG__ = {
  apiBaseUrl: '',
};
