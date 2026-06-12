# Quickstart — No-code automation (n8n / Make / Zapier)

Turn any URL into a screenshot or PDF inside an automation, with one HTTP call.
No server, no headless browser.

> Uses the RapidAPI gateway. Header `X-RapidAPI-Key` = your key,
> `X-RapidAPI-Host` = `screenshot-e-pdf-render.p.rapidapi.com`.

## n8n — HTTP Request node

- Method: `GET`
- URL: `https://screenshot-e-pdf-render.p.rapidapi.com/v1/screenshot`
- Query params: `url=https://example.com`, `type=webp`, `fullPage=true`
- Headers: `X-RapidAPI-Key`, `X-RapidAPI-Host`
- Response: set "Response Format" to **File** to get the binary image, then wire
  it into a Google Drive / S3 / Slack node.

For JSON output (base64), add `&response=json` and read `data`.

## Make (Integromat) — generate a PDF after a webhook

- Module: **HTTP → Make a request**
- Method: `POST`
- URL: `https://screenshot-e-pdf-render.p.rapidapi.com/v1/pdf`
- Headers: `X-RapidAPI-Key`, `X-RapidAPI-Host`, `Content-Type: application/json`
- Body (JSON):

```json
{ "url": "https://example.com/invoice/123", "format": "A4", "printBackground": true, "pageNumbers": true }
```

- "Parse response" off → you get the PDF bytes to drop into Dropbox / email.

## Zapier — attach a screenshot to a CRM/ticket

Use a **Webhooks by Zapier → Custom Request (GET)** step pointing at
`/v1/screenshot?url={{url}}&type=png`, with the two RapidAPI headers, then map
the file output into your CRM/Helpdesk action.

## cURL (works anywhere)

```bash
curl --request GET \
  --url 'https://screenshot-e-pdf-render.p.rapidapi.com/v1/screenshot?url=https://example.com&type=webp&fullPage=true' \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
  --header 'X-RapidAPI-Host: screenshot-e-pdf-render.p.rapidapi.com' \
  --output shot.webp
```

## Tips

- One key, billed via RapidAPI — no second auth flow to build.
- `blockCookieBanners=true` and `blockAds=true` give clean captures.
- `device=iphone_15` (or pixel_7, ipad…) for mobile renders.

Next: [evidence-compliance.md](evidence-compliance.md)
