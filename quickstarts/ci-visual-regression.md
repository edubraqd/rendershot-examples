# Quickstart — Visual regression in CI (QA / Engineering)

Catch visual regressions on every pull request without running a headless
browser in your pipeline. Capture a baseline, run a pixel diff, fail the build
when the page changed more than your threshold.

> Uses `POST /v1/diff` through the RapidAPI gateway. Set `RAPIDAPI_KEY` as a
> repo secret. (Diff must be enabled on the RapidAPI listing.)

## 1. One diff call (metrics-first — no image downloaded)

```bash
curl -s --request POST \
  --url https://screenshot-e-pdf-render.p.rapidapi.com/v1/diff \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
  --header "X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com" \
  --header 'Content-Type: application/json' \
  --data '{
    "baseline":  { "url": "https://prod.example.com/pricing" },
    "candidate": { "url": "https://preview.example.com/pricing" },
    "options": { "diffOutput": "metrics", "fullPage": true,
                 "ignoreSelectors": [".cookie-banner", "[data-dynamic]"] }
  }'
```

Response (no image, fast):

```json
{ "changed": true, "difference_percentage": 2.41, "different_pixels": 18960,
  "total_pixels": 786432, "fast_path": false }
```

Identical pages take a SHA-256 fast path (`fast_path: true`, `difference_percentage: 0`).
Ask for the image only when something changed: `"diffOutput": "image"`.

## 2. GitHub Actions — fail the PR on regression

```yaml
# .github/workflows/visual-diff.yml
name: Visual diff
on: [pull_request]
jobs:
  diff:
    runs-on: ubuntu-latest
    steps:
      - name: Compare production vs preview
        env:
          RAPIDAPI_KEY: ${{ secrets.RAPIDAPI_KEY }}
        run: |
          curl -s --request POST \
            --url https://screenshot-e-pdf-render.p.rapidapi.com/v1/diff \
            --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
            --header "X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com" \
            --header 'Content-Type: application/json' \
            --data '{"baseline":{"url":"https://prod.example.com"},"candidate":{"url":"https://preview.example.com"},"options":{"diffOutput":"metrics","fullPage":true}}' \
            -o diff.json
          PCT=$(jq -r '.difference_percentage' diff.json)
          echo "Difference: ${PCT}%"
          awk "BEGIN{exit !(${PCT} > 1.0)}" \
            && { echo '::error::Visual regression > 1%'; exit 1; } \
            || echo 'Within threshold.'
```

## Why this beats a self-hosted browser

- No Chromium/Playwright install or version drift in CI.
- `ignoreRegions` / `ignoreSelectors` kill false positives from banners, ads and
  dynamic widgets.
- Metrics-first means you pay for a number, not a megabyte, on every green run.

Next: [evidence-compliance.md](evidence-compliance.md) · [seo-competitor-monitoring.md](seo-competitor-monitoring.md)
