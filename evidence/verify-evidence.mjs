// Verify a RenderShot evidence manifest (Ed25519). Node 18+.
// Usage: node verify-evidence.mjs evidence.json
//   where evidence.json is the JSON body returned by POST /v1/evidence.
import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';

const ev = JSON.parse(readFileSync(process.argv[2] || 'evidence.json', 'utf8'));

// The public key is served publicly (no API key needed).
const pub = await (await fetch('https://api.rendershot.dev/v1/meta/evidence-public-key')).json();

// Canonical JSON: recursively sort keys, then JSON.stringify (no spaces).
const sortKeys = (v) =>
  Array.isArray(v)
    ? v.map(sortKeys)
    : v && typeof v === 'object'
      ? Object.keys(v).sort().reduce((o, k) => ((o[k] = sortKeys(v[k])), o), {})
      : v;
const canon = (v) => JSON.stringify(sortKeys(v));

// The signed object is the manifest WITHOUT the signature block.
const { signature, signature_algorithm, public_key_id, ...core } = ev.manifest;
const publicKey = crypto.createPublicKey(pub.public_key_pem);

const signatureValid = crypto.verify(null, Buffer.from(canon(core)), publicKey, Buffer.from(signature, 'base64'));

// If the artifact bytes are present, confirm they match the signed hash.
let hashMatches = true;
if (ev.artifact?.data) {
  const sha = crypto.createHash('sha256').update(Buffer.from(ev.artifact.data, 'base64')).digest('hex');
  hashMatches = sha === core.artifact.sha256;
}

console.log('signature valid:      ', signatureValid);
console.log('artifact hash matches:', hashMatches);
console.log('key id:               ', public_key_id, `(${signature_algorithm})`);
process.exit(signatureValid && hashMatches ? 0 : 1);
