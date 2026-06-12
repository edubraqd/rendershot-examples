"""Capture a website screenshot (WebP) via the RapidAPI gateway.
Usage: python screenshot.py [url] [output]
"""
import os
import sys
import requests

KEY = os.environ.get("RENDERSHOT_API_KEY")
HOST = os.environ.get("RENDERSHOT_RAPIDAPI_HOST", "screenshot-e-pdf-render.p.rapidapi.com")
if not KEY:
    sys.exit("Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)")

url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
out = sys.argv[2] if len(sys.argv) > 2 else "screenshot.webp"

resp = requests.get(
    f"https://{HOST}/v1/screenshot",
    params={"url": url, "type": "webp", "fullPage": "true", "blockCookieBanners": "true"},
    headers={"X-RapidAPI-Key": KEY, "X-RapidAPI-Host": HOST},
    timeout=60,
)

if not resp.ok:
    sys.exit(f"Error: HTTP {resp.status_code} {resp.text[:300]}")

with open(out, "wb") as f:
    f.write(resp.content)
print(f"Saved {out} ({len(resp.content)} bytes)")
