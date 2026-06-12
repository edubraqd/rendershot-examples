# Quickstart — SEO & competitor monitoring (Growth / Agencies)

Capture clean desktop + mobile snapshots of SERPs, competitor and pricing pages,
detect what changed, and hand clients a visual report — without manual
screenshots.

> Uses the RapidAPI gateway (`X-RapidAPI-Key` + `X-RapidAPI-Host`). Diff requires
> the Diff endpoint on the RapidAPI listing.

## 1. Clean desktop + mobile captures

```bash
# desktop
curl -s --url 'https://screenshot-e-pdf-render.p.rapidapi.com/v1/screenshot?url=https://competitor.com/pricing&type=webp&fullPage=true&blockCookieBanners=true&blockAds=true' \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" --header 'X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com' \
  --output competitor-desktop.webp

# mobile (device emulation)
curl -s --url 'https://screenshot-e-pdf-render.p.rapidapi.com/v1/screenshot?url=https://competitor.com/pricing&type=webp&fullPage=true&device=iphone_15' \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" --header 'X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com' \
  --output competitor-mobile.webp
```

## 2. Detect a competitor change (price/layout)

Store a baseline, then diff the latest capture against it:

```bash
curl -s --request POST \
  --url https://screenshot-e-pdf-render.p.rapidapi.com/v1/diff \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
  --header "X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com" \
  --header 'Content-Type: application/json' \
  --data '{"baseline":{"url":"https://competitor.com/pricing"},"candidate":{"url":"https://competitor.com/pricing"},"options":{"diffOutput":"image","device":"iphone_15"}}'
```

`difference_percentage` tells you *if* it changed; the diff image shows *where*.
(Baseline vs the same URL on a later run = re-capture both; or store yesterday's
image and compare visually.)

## 3. Client-ready report

Render a summary HTML page to PDF for the weekly report:

```bash
curl -s --request POST \
  --url https://screenshot-e-pdf-render.p.rapidapi.com/v1/pdf \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
  --header "X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com" \
  --header 'Content-Type: application/json' \
  --data '{"html":"<h1>Weekly visual report</h1>…","format":"A4","pageNumbers":true}' \
  --output report.pdf
```

## Tips

- Always capture desktop **and** mobile — they tell different stories.
- `blockCookieBanners` + `blockAds` keep captures clean for client decks.
- Schedule from n8n/cron; keep a dated folder of WebP baselines per URL.

Back to [all quickstarts](README.md)
