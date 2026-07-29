#!/usr/bin/env bash
set -euo pipefail

: "${HEALTH_URL:?HEALTH_URL is required}"
: "${EXPECTED_SHA:?EXPECTED_SHA is required}"

curl --fail --silent --show-error --retry 5 --retry-delay 3 --max-time 10 "$HEALTH_URL" > /dev/null

# A 200 above only proves *something* is answering — not that it's this deploy.
# version.txt is baked into the image at build time, so a mismatch here means
# the container serving traffic wasn't actually replaced.
DEPLOYED_SHA="$(curl --fail --silent --show-error --retry 5 --retry-delay 3 --max-time 10 "$HEALTH_URL/version.txt?cb=$(date +%s)")"
if [ "$DEPLOYED_SHA" != "$EXPECTED_SHA" ]; then
  echo "Deployed version mismatch: expected $EXPECTED_SHA, live site is serving $DEPLOYED_SHA" >&2
  exit 1
fi
