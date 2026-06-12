<?php
// Generate a PDF from raw HTML (with page numbers).
// Usage: php pdf.php [output]

$key = getenv('RENDERSHOT_API_KEY');
$base = getenv('RENDERSHOT_API_URL') ?: 'https://api.rendershot.dev';
if (!$key) {
    fwrite(STDERR, "Set RENDERSHOT_API_KEY (see .env.example)\n");
    exit(1);
}

$out = $argv[1] ?? 'invoice.pdf';

$payload = json_encode([
    'html' => '<h1>Invoice #42</h1><p>Total: $99.00</p>',
    'pageNumbers' => true,
]);

$ch = curl_init("$base/v1/pdf");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ["x-api-key: $key", "content-type: application/json"],
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code < 200 || $code >= 300) {
    fwrite(STDERR, "Error: HTTP $code\n$body\n");
    exit(1);
}

file_put_contents($out, $body);
echo "Saved $out (" . strlen($body) . " bytes)\n";
