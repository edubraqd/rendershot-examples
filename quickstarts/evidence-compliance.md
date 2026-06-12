# Quickstart — Verifiable Evidence (Compliance / Risk / Legal Ops)

Capture a tamper-evident record of what a page showed: the artifact plus a
canonical manifest carrying its SHA-256 and an **Ed25519 signature** you can
verify offline. For audits, disputes and change tracking.

> Honest scope: this is a *verifiable technical capture*, not a turnkey
> regulatory archive. Pair it with your own retention/supervision policy.

> Uses `POST /v1/evidence` through the RapidAPI gateway. (Evidence must be
> enabled on the RapidAPI listing.)

## 1. Capture — get a signed ZIP

```bash
curl -s --request POST \
  --url https://screenshot-e-pdf-render.p.rapidapi.com/v1/evidence \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
  --header "X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com" \
  --header 'Content-Type: application/json' \
  --data '{ "url": "https://example.com/terms", "response_mode": "archive", "quality_profile": "standard" }' \
  --output evidence.zip
```

The ZIP contains:

```
artifact.webp        the capture
manifest.json        canonical (sorted-key) payload: artifact_sha256, captured_at,
                     requested_url, final_url, viewport, engine versions + signature
signature.txt        Ed25519 signature (base64) over the canonical manifest
public-key.json      the signing public key (id key_2026_01)
```

For `forensic` evidence use `"quality_profile": "forensic"` (lossless PNG, no
determinism normalisation). For inline base64 instead of a ZIP, use
`"response_mode": "json"` (small artifacts only — large ones return 413).

## 2. Verify — offline, no trust in us

The public key is also at `GET /v1/meta/evidence-public-key`. Ready-made
verifiers (Node / Python / PHP) live in [`../evidence/`](../evidence/):

```bash
node ../evidence/verify-evidence.mjs ./evidence.zip
# -> recomputes SHA-256, rebuilds the canonical manifest, checks the Ed25519 signature
```

A 1-field change to the manifest makes verification fail — that is the point.

## 3. Operationalise

- Capture your critical pages (pricing, TOS, disclosures) on a schedule from
  n8n/cron and store the ZIPs.
- Use [diff](ci-visual-regression.md) between two dates to show *what* changed.

Next: [seo-competitor-monitoring.md](seo-competitor-monitoring.md)
