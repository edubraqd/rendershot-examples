# RenderShot — Examples

Official, copy-paste examples for the [RenderShot](https://rendershot.dev) screenshot & PDF API — turn any URL or HTML into PNG / JPEG / WebP or PDF.

- **Website:** https://rendershot.dev
- **API docs:** https://api.rendershot.dev/docs
- **Get a free API key (RapidAPI):** https://rapidapi.com/eduardoalcantarasp/api/screenshot-e-pdf-render
- **GitHub Action:** https://github.com/edubraqd/rendershot-action

## Setup

```bash
cp .env.example .env
# edit .env and set RENDERSHOT_API_KEY
export $(grep -v '^#' .env | xargs)   # load into your bash shell
```

`RENDERSHOT_API_KEY` is required. `RENDERSHOT_API_URL` defaults to `https://api.rendershot.dev`.

## Examples

| Language | Screenshot | PDF |
|---|---|---|
| cURL | `curl/screenshot.sh` | `curl/pdf-url.sh`, `curl/pdf-html.sh` |
| Node.js (18+) | `node/screenshot.mjs` | `node/pdf-url.mjs`, `node/pdf-html.mjs` |
| Python (3.8+) | `python/screenshot.py` | `python/pdf.py` |
| PHP (8+) | `php/screenshot.php` | `php/pdf.php` |
| GitHub Actions | `github-actions/screenshot.yml` | — |
| Postman | `postman/RenderShot.postman_collection.json` | |

### Run them

```bash
# cURL
bash curl/screenshot.sh https://example.com out.webp

# Node (no dependencies, uses built-in fetch)
node node/screenshot.mjs https://example.com out.webp

# Python
pip install -r python/requirements.txt
python python/screenshot.py https://example.com out.webp

# PHP
php php/screenshot.php https://example.com out.webp
```

## Supported formats

- **Screenshots:** `png`, `jpeg`, `webp` (full-page, device presets, dark mode, ad/cookie-banner blocking, element clipping, `waitForSelector`)
- **Documents:** `pdf` from a URL or raw HTML (formats, margins, headers/footers, page numbers)

## Getting an API key

Subscribe on [RapidAPI](https://rapidapi.com/eduardoalcantarasp/api/screenshot-e-pdf-render). The free plan needs no credit card. Errors, quotas and rate limits follow your subscribed plan.

## Status

Live API health: https://api.rendershot.dev/health

## License

MIT — see [LICENSE](LICENSE).
