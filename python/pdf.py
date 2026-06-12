"""Generate a PDF from raw HTML (with page numbers) via the RapidAPI gateway.
Usage: python pdf.py [output]
"""
import os
import sys
import requests

KEY = os.environ.get("RENDERSHOT_API_KEY")
HOST = os.environ.get("RENDERSHOT_RAPIDAPI_HOST", "screenshot-e-pdf-render.p.rapidapi.com")
if not KEY:
    sys.exit("Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)")

out = sys.argv[1] if len(sys.argv) > 1 else "invoice.pdf"

resp = requests.post(
    f"https://{HOST}/v1/pdf",
    headers={"X-RapidAPI-Key": KEY, "X-RapidAPI-Host": HOST, "content-type": "application/json"},
    json={"html": "<h1>Invoice #42</h1><p>Total: $99.00</p>", "pageNumbers": True},
    timeout=60,
)

if not resp.ok:
    sys.exit(f"Error: HTTP {resp.status_code} {resp.text[:300]}")

with open(out, "wb") as f:
    f.write(resp.content)
print(f"Saved {out} ({len(resp.content)} bytes)")
