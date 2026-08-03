#!/usr/bin/env bash
set -euo pipefail

: "${HEALTH_URL:?HEALTH_URL is required}"
: "${EXPECTED_SHA:?EXPECTED_SHA is required}"

curl --fail --silent --show-error --retry 5 --retry-delay 3 --max-time 10 "$HEALTH_URL" > /dev/null

# A 200 above only proves *something* is answering — not that it's this deploy.
# version.txt is baked into the image at build time, so a mismatch here means
# the container serving traffic wasn't actually replaced.
#
# Retried on its own, separately from curl's --retry above: curl's retry only
# covers transport-level failures (connection refused, timeout, non-2xx), but
# a version mismatch is a *successful* response with a stale body — the old
# container can still answer for a moment after `docker compose up
# --force-recreate` reports the new one "Started", so a single immediate
# check can catch that handoff mid-flight and fail a deploy that would have
# settled correctly a few seconds later.
attempts=5
delay=3
for attempt in $(seq 1 "$attempts"); do
  DEPLOYED_SHA="$(curl --fail --silent --show-error --max-time 10 "$HEALTH_URL/version.txt?cb=$(date +%s)")"
  if [ "$DEPLOYED_SHA" = "$EXPECTED_SHA" ]; then
    exit 0
  fi
  if [ "$attempt" -lt "$attempts" ]; then
    echo "Deployed version mismatch (attempt $attempt/$attempts): expected $EXPECTED_SHA, live site is serving $DEPLOYED_SHA — retrying in ${delay}s" >&2
    sleep "$delay"
  fi
done

echo "Deployed version mismatch: expected $EXPECTED_SHA, live site is serving $DEPLOYED_SHA" >&2
exit 1
