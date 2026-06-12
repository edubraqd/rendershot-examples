<?php
// Generate a PDF from raw HTML (with page numbers) via the RapidAPI gateway.
// Usage: php pdf.php [output]

$key = getenv('RENDERSHOT_API_KEY');
$host = getenv('RENDERSHOT_RAPIDAPI_HOST') ?: 'screenshot-e-pdf-render.p.rapidapi.com';
if (!$key) {
    fwrite(STDERR, "Set RENDERSHOT_API_KEY to your RapidAPI key (see .env.example)\n");
    exit(1);
}

$out = $argv[1] ?? 'invoice.pdf';

$payload = json_encode([
    'html' => '<h1>Invoice #42</h1><p>Total: $99.00</p>',
    'pageNumbers' => true,
]);

$ch = curl_init("https://$host/v1/pdf");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Key: $key",
        "X-RapidAPI-Host: $host",
        "content-type: application/json",
    ],
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
