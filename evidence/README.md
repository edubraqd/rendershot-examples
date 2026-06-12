# Evidence Mode — verification

`POST /v1/evidence` (via the RapidAPI gateway) returns a screenshot/PDF artifact **plus** a canonical, Ed25519-signed **manifest** that binds the capture to a SHA-256 of the artifact, the final URL, HTTP status, render settings and browser version.

Anyone can verify it offline using only the **public key** — no API key needed:

```
GET https://api.rendershot.dev/v1/meta/evidence-public-key
```

## How verification works

1. Take the `manifest` object from the response.
2. Remove `signature`, `signature_algorithm` and `public_key_id`.
3. Canonicalize the remaining object as JSON with **recursively sorted keys** and no extra whitespace.
4. Ed25519-verify that canonical bytes against the base64 `signature` using the public key.
5. (Optional) Confirm `sha256(artifact bytes) == manifest.artifact.sha256`.

Changing a single field of the manifest, or the artifact, breaks verification.

## Run

```bash
# save a POST /v1/evidence response to evidence.json, then:
node verify-evidence.mjs evidence.json
pip install cryptography && python verify_evidence.py evidence.json
php verify-evidence.php evidence.json   # requires the sodium extension
```

## Honest positioning

RenderShot Evidence Mode produces a **tamper-evident technical capture with cryptographic verification**. It is **not** a notarial service, a legal certification, or a qualified digital signature (e.g. ICP-Brasil). Use it for audit trails, change records and technical proof — not as a substitute for jurisdiction-specific legal certification.
