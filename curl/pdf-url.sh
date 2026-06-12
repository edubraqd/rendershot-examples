#!/usr/bin/env bash
# Generate a PDF from a URL via the RapidAPI gateway.
# Usage: bash curl/pdf-url.sh [url] [output]
set -euo pipefail
: "${RENDERSHOT_API_KEY:?Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)}"
HOST="${RENDERSHOT_RAPIDAPI_HOST:-screenshot-e-pdf-render.p.rapidapi.com}"
URL="${1:-https://example.com}"
OUT="${2:-page.pdf}"

code=$(curl -sS -X POST "https://$HOST/v1/pdf" \
  -H "X-RapidAPI-Key: $RENDERSHOT_API_KEY" \
  -H "X-RapidAPI-Host: $HOST" \
  -H "content-type: application/json" \
  -d "{\"url\":\"$URL\",\"format\":\"A4\"}" \
  -w '%{http_code}' --output "$OUT")

if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
  echo "Saved $OUT ($(wc -c < "$OUT") bytes)"
else
  echo "Error: HTTP $code" >&2
  cat "$OUT" >&2 || true
  rm -f "$OUT"
  exit 1
fi
