<?php
// Verify a RenderShot evidence manifest (Ed25519). Requires the sodium extension.
// Usage: php verify-evidence.php evidence.json

$path = $argv[1] ?? 'evidence.json';
$ev = json_decode(file_get_contents($path), true);

// Public key is served publicly (no API key needed).
$pub = json_decode(file_get_contents('https://api.rendershot.dev/v1/meta/evidence-public-key'), true);

$manifest = $ev['manifest'];
$signature = base64_decode($manifest['signature']);
unset($manifest['signature'], $manifest['signature_algorithm'], $manifest['public_key_id']);

// Canonical JSON: recursively sort keys; do not escape slashes/unicode (matches the server).
function ksort_recursive(&$v) {
    if (is_array($v)) {
        foreach ($v as &$child) ksort_recursive($child);
        if (array_keys($v) !== range(0, count($v) - 1)) ksort($v);
    }
}
ksort_recursive($manifest);
$canonical = json_encode($manifest, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

// Extract the raw 32-byte Ed25519 key from the SPKI PEM (last 32 bytes of the DER).
$der = base64_decode(preg_replace('/-----[^-]+-----|\s/', '', $pub['public_key_pem']));
$rawKey = substr($der, -32);

$signatureValid = sodium_crypto_sign_verify_detached($signature, $canonical, $rawKey);

$hashMatches = true;
if (!empty($ev['artifact']['data'])) {
    $sha = hash('sha256', base64_decode($ev['artifact']['data']));
    $hashMatches = $sha === $manifest['artifact']['sha256'];
}

echo 'signature valid:       ' . ($signatureValid ? 'true' : 'false') . "\n";
echo 'artifact hash matches: ' . ($hashMatches ? 'true' : 'false') . "\n";
exit($signatureValid && $hashMatches ? 0 : 1);
