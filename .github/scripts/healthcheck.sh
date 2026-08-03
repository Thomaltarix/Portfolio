#!/usr/bin/env bash
set -euo pipefail

: "${HEALTH_URL:?HEALTH_URL is required}"

# Confirms the public URL is reachable end-to-end (DNS, TLS, Cloudflare,
# the VPS's own Nginx vhost). It does NOT verify which build is live —
# that's checked authoritatively inside the deploy action's SSH session,
# via a loopback curl straight to the container on the VPS, bypassing
# Cloudflare entirely. Comparing version.txt through the public URL used
# to live here too, but Cloudflare's edge can briefly serve a stale
# cached response right after the origin container swap, which failed a
# deploy that had actually succeeded — see the deploy action for the
# real check.
curl --fail --silent --show-error --retry 5 --retry-delay 3 --max-time 10 "$HEALTH_URL" > /dev/null
