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

# The résumés now live in the API (replaced from the admin), but links to the
# old static /resume-<lang>.pdf URLs are already out there — in sent
# applications and llms.txt — so they redirect to the current file instead of
# breaking. This lands inside an nginx config rather than a JS string, so the
# URL is allowlisted instead of escaped: anything else (";", "}", spaces...)
# could inject directives, and is skipped with a warning.
redirect_conf=/etc/nginx/runtime/resume-redirect.conf
api_url=$(printf '%s' "${API_BASE_URL:-}" | sed 's:/*$::')

if printf '%s' "$api_url" | grep -Eq '^https?://[A-Za-z0-9.-]+(:[0-9]+)?(/[A-Za-z0-9._~/-]*)?$'; then
  cat <<EOF > "$redirect_conf"
location ~ ^/resume-(en|fr)\.pdf\$ {
    # Never cached, so the redirect always reaches the résumé currently uploaded.
    add_header Cache-Control "no-store" always;
    return 302 ${api_url}/resume/\$1;
}
EOF
else
  echo "40-generate-runtime-config: API_BASE_URL is not a plain http(s) URL, old résumé URLs will not redirect" >&2
  : > "$redirect_conf"
fi
