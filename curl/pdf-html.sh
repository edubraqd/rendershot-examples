#!/usr/bin/env bash
# Generate a PDF from raw HTML (with page numbers).
# Usage: bash curl/pdf-html.sh [output]
set -euo pipefail
: "${RENDERSHOT_API_KEY:?Set RENDERSHOT_API_KEY (see .env.example)}"
BASE="${RENDERSHOT_API_URL:-https://api.rendershot.dev}"
OUT="${1:-invoice.pdf}"

code=$(curl -sS -X POST "$BASE/v1/pdf" \
  -H "x-api-key: $RENDERSHOT_API_KEY" \
  -H "content-type: application/json" \
  -d '{"html":"<h1>Invoice #42</h1><p>Total: $99.00</p>","pageNumbers":true}' \
  -w '%{http_code}' --output "$OUT")

if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
  echo "Saved $OUT ($(wc -c < "$OUT") bytes)"
else
  echo "Error: HTTP $code" >&2
  cat "$OUT" >&2 || true
  rm -f "$OUT"
  exit 1
fi
