"""Verify a RenderShot evidence manifest (Ed25519).
Usage: pip install cryptography && python verify_evidence.py evidence.json
"""
import sys
import json
import base64
import hashlib
import urllib.request
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.exceptions import InvalidSignature

path = sys.argv[1] if len(sys.argv) > 1 else "evidence.json"
with open(path) as f:
    ev = json.load(f)

# Public key is served publicly (no API key needed).
with urllib.request.urlopen("https://api.rendershot.dev/v1/meta/evidence-public-key") as r:
    pub = json.load(r)

manifest = dict(ev["manifest"])
signature = base64.b64decode(manifest.pop("signature"))
manifest.pop("signature_algorithm", None)
manifest.pop("public_key_id", None)

# Canonical JSON: sorted keys, compact separators — matches the server.
canonical = json.dumps(manifest, sort_keys=True, separators=(",", ":")).encode()

public_key = load_pem_public_key(pub["public_key_pem"].encode())
try:
    public_key.verify(signature, canonical)
    signature_valid = True
except InvalidSignature:
    signature_valid = False

hash_matches = True
artifact = ev.get("artifact") or {}
if artifact.get("data"):
    sha = hashlib.sha256(base64.b64decode(artifact["data"])).hexdigest()
    hash_matches = sha == manifest["artifact"]["sha256"]

print("signature valid:      ", signature_valid)
print("artifact hash matches:", hash_matches)
sys.exit(0 if signature_valid and hash_matches else 1)
