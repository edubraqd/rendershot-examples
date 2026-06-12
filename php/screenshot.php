<?php
// Capture a website screenshot (WebP).
// Usage: php screenshot.php [url] [output]

$key = getenv('RENDERSHOT_API_KEY');
$base = getenv('RENDERSHOT_API_URL') ?: 'https://api.rendershot.dev';
if (!$key) {
    fwrite(STDERR, "Set RENDERSHOT_API_KEY (see .env.example)\n");
    exit(1);
}

$url = $argv[1] ?? 'https://example.com';
$out = $argv[2] ?? 'screenshot.webp';

$qs = http_build_query([
    'url' => $url,
    'type' => 'webp',
    'fullPage' => 'true',
    'blockCookieBanners' => 'true',
]);

$ch = curl_init("$base/v1/screenshot?$qs");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["x-api-key: $key"],
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
