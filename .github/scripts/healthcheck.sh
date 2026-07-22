#!/usr/bin/env bash
set -euo pipefail

: "${HEALTH_URL:?HEALTH_URL is required}"

curl --fail --silent --show-error --retry 5 --retry-delay 3 --max-time 10 "$HEALTH_URL" > /dev/null
