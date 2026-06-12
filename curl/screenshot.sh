#!/usr/bin/env bash
# Capture a website screenshot (WebP) via the RapidAPI gateway.
# Usage: bash curl/screenshot.sh [url] [output]
set -euo pipefail
: "${RENDERSHOT_API_KEY:?Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)}"
HOST="${RENDERSHOT_RAPIDAPI_HOST:-screenshot-e-pdf-render.p.rapidapi.com}"
URL="${1:-https://example.com}"
OUT="${2:-screenshot.webp}"

code=$(curl -sS -G "https://$HOST/v1/screenshot" \
  --data-urlencode "url=$URL" \
  --data-urlencode "type=webp" \
  --data-urlencode "fullPage=true" \
  --data-urlencode "blockCookieBanners=true" \
  -H "X-RapidAPI-Key: $RENDERSHOT_API_KEY" \
  -H "X-RapidAPI-Host: $HOST" \
  -w '%{http_code}' --output "$OUT")

if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
  echo "Saved $OUT ($(wc -c < "$OUT") bytes)"
else
  echo "Error: HTTP $code" >&2
  cat "$OUT" >&2 || true
  rm -f "$OUT"
  exit 1
fi
