// Capture a website screenshot (WebP). Node 18+ (built-in fetch).
// Usage: node screenshot.mjs [url] [output]
import { writeFile } from 'node:fs/promises';

const KEY = process.env.RENDERSHOT_API_KEY;
const BASE = process.env.RENDERSHOT_API_URL || 'https://api.rendershot.dev';
if (!KEY) {
  console.error('Set RENDERSHOT_API_KEY (see .env.example)');
  process.exit(1);
}

const url = process.argv[2] || 'https://example.com';
const out = process.argv[3] || 'screenshot.webp';

const qs = new URLSearchParams({
  url,
  type: 'webp',
  fullPage: 'true',
  blockCookieBanners: 'true',
});

const res = await fetch(`${BASE}/v1/screenshot?${qs}`, {
  headers: { 'x-api-key': KEY },
});

if (!res.ok) {
  console.error(`Error: HTTP ${res.status}`, await res.text());
  process.exit(1);
}

await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`Saved ${out}`);
