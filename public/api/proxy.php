<?php
/**
 * VibeMed Hostinger API Reverse Proxy
 * Forwards requests to https://vibemed.just4madam.com/api/v1
 * Completely eliminates browser CORS errors on custom domains like vibemed.vibbevital.com
 */

// Disable output buffering to stream responses
while (ob_get_level()) {
    ob_end_clean();
}

$targetHost = 'https://vibemed.just4madam.com/api/v1';
$requestUri = $_SERVER['REQUEST_URI'] ?? '';

// Extract endpoint after /api/proxy.php or /api/v1
$path = '';
if (preg_match('#/api/proxy\.php(/.*)?$#', $requestUri, $matches)) {
    $path = $matches[1] ?? '';
} elseif (preg_match('#/api/v1(/.*)?$#', $requestUri, $matches)) {
    $path = $matches[1] ?? '';
} else {
    $path = preg_replace('#^/api#', '', $requestUri);
}

// Preserve query string
$queryString = $_SERVER['QUERY_STRING'] ?? '';
$targetUrl = $targetHost . $path;
if (!empty($queryString) && strpos($path, '?') === false) {
    $targetUrl .= '?' . $queryString;
}

// Read incoming request method and body
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$inputBody = file_get_contents('php://input');

// Forward all incoming client headers
$forwardHeaders = [
    'Accept: application/json',
    'X-Tenant: demo.just4madam.com',
];

if (isset($_SERVER['CONTENT_TYPE'])) {
    $forwardHeaders[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
} elseif ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    $forwardHeaders[] = 'Content-Type: application/json';
}

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $forwardHeaders[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $forwardHeaders[] = 'Authorization: ' . $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}

if (isset($_SERVER['HTTP_X_TENANT'])) {
    $forwardHeaders[] = 'X-Tenant: ' . $_SERVER['HTTP_X_TENANT'];
}

if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    $forwardHeaders[] = 'X-Requested-With: ' . $_SERVER['HTTP_X_REQUESTED_WITH'];
}

// Initialize cURL to backend
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

if (!empty($inputBody) && in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $inputBody);
}

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Proxy Gateway Error: ' . curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$rawHeaders = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

http_response_code($httpCode);

// Pass through response headers (Content-Type, etc.)
foreach (explode("\r\n", $rawHeaders) as $headerLine) {
    if (stripos($headerLine, 'Content-Type:') === 0) {
        header($headerLine);
    }
}

// Allow same-origin client access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Tenant, X-Requested-With, Accept');

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

echo $body;
