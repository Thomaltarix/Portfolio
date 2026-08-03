#!/bin/sh
set -eu

# Overwrites the placeholder shipped in the image with the API base URL the
# container was actually started with — this is what makes the API URL
# changeable without a rebuild. See claude/architecture.md.
cat <<EOF > /usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  apiBaseUrl: "${API_BASE_URL:-}",
};
EOF

exec "$@"
