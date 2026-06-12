// Generate a PDF from a URL via the RapidAPI gateway. Node 18+.
// Usage: node pdf-url.mjs [url] [output]
import { writeFile } from 'node:fs/promises';

const KEY = process.env.RENDERSHOT_API_KEY;
const HOST = process.env.RENDERSHOT_RAPIDAPI_HOST || 'screenshot-e-pdf-render.p.rapidapi.com';
if (!KEY) {
  console.error('Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)');
  process.exit(1);
}

const url = process.argv[2] || 'https://example.com';
const out = process.argv[3] || 'page.pdf';

const res = await fetch(`https://${HOST}/v1/pdf`, {
  method: 'POST',
  headers: { 'X-RapidAPI-Key': KEY, 'X-RapidAPI-Host': HOST, 'content-type': 'application/json' },
  body: JSON.stringify({ url, format: 'A4' }),
});

if (!res.ok) {
  console.error(`Error: HTTP ${res.status}`, await res.text());
  process.exit(1);
}

await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`Saved ${out}`);
