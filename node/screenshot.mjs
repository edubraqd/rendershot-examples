// Capture a website screenshot (WebP) via the RapidAPI gateway. Node 18+.
// Usage: node screenshot.mjs [url] [output]
import { writeFile } from 'node:fs/promises';

const KEY = process.env.RENDERSHOT_API_KEY;
const HOST = process.env.RENDERSHOT_RAPIDAPI_HOST || 'screenshot-e-pdf-render.p.rapidapi.com';
if (!KEY) {
  console.error('Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)');
  process.exit(1);
}

const url = process.argv[2] || 'https://example.com';
const out = process.argv[3] || 'screenshot.webp';

const qs = new URLSearchParams({ url, type: 'webp', fullPage: 'true', blockCookieBanners: 'true' });

const res = await fetch(`https://${HOST}/v1/screenshot?${qs}`, {
  headers: { 'X-RapidAPI-Key': KEY, 'X-RapidAPI-Host': HOST },
});

if (!res.ok) {
  console.error(`Error: HTTP ${res.status}`, await res.text());
  process.exit(1);
}

await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`Saved ${out}`);
