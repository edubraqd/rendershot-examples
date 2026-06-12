// Generate a PDF from raw HTML (with page numbers). Node 18+.
// Usage: node pdf-html.mjs [output]
import { writeFile } from 'node:fs/promises';

const KEY = process.env.RENDERSHOT_API_KEY;
const BASE = process.env.RENDERSHOT_API_URL || 'https://api.rendershot.dev';
if (!KEY) {
  console.error('Set RENDERSHOT_API_KEY (see .env.example)');
  process.exit(1);
}

const out = process.argv[2] || 'invoice.pdf';

const res = await fetch(`${BASE}/v1/pdf`, {
  method: 'POST',
  headers: { 'x-api-key': KEY, 'content-type': 'application/json' },
  body: JSON.stringify({
    html: '<h1>Invoice #42</h1><p>Total: $99.00</p>',
    pageNumbers: true,
  }),
});

if (!res.ok) {
  console.error(`Error: HTTP ${res.status}`, await res.text());
  process.exit(1);
}

await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`Saved ${out}`);
