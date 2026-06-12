"""Generate a PDF from raw HTML (with page numbers).
Usage: python pdf.py [output]
"""
import os
import sys
import requests

KEY = os.environ.get("RENDERSHOT_API_KEY")
BASE = os.environ.get("RENDERSHOT_API_URL", "https://api.rendershot.dev")
if not KEY:
    sys.exit("Set RENDERSHOT_API_KEY (see .env.example)")

out = sys.argv[1] if len(sys.argv) > 1 else "invoice.pdf"

resp = requests.post(
    f"{BASE}/v1/pdf",
    headers={"x-api-key": KEY, "content-type": "application/json"},
    json={"html": "<h1>Invoice #42</h1><p>Total: $99.00</p>", "pageNumbers": True},
    timeout=60,
)

if not resp.ok:
    sys.exit(f"Error: HTTP {resp.status_code} {resp.text[:300]}")

with open(out, "wb") as f:
    f.write(resp.content)
print(f"Saved {out} ({len(resp.content)} bytes)")
