#!/bin/sh
set -eu

# Runs via the official nginx image's own /docker-entrypoint.sh, which
# executes every *.sh script in this directory before starting nginx — we
# don't own the entrypoint ourselves, so upstream's own startup behavior
# (e.g. envsubst on /etc/nginx/templates) keeps working across nginx
# version bumps.
#
# Overwrites the placeholder shipped in the image with the API base URL the
# container was actually started with — this is what makes the API URL
# changeable without a rebuild. See claude/architecture.md.
#
# API_BASE_URL is operator-controlled (from docker-compose.yml/.env, never
# client input), but it's still escaped before landing inside a JS string
# literal so a stray quote or backslash can't produce invalid/malicious JS.
escaped_url=$(printf '%s' "${API_BASE_URL:-}" | sed 's/\\/\\\\/g; s/"/\\"/g')

cat <<EOF > /usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  apiBaseUrl: "${escaped_url}",
};
EOF
