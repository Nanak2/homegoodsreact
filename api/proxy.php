<?php
// ============================================================================
// GHHomegoods PHP Proxy with CORS and Health Check
// ============================================================================

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxejTUnbE2sDmJxmdtwb-p-Uj6c973U9Y3YNR0TuWQ9Uml2429Sq7_NLhbksA2VnyM6/exec';

const ALLOWED_ORIGINS = [
    'https://ghhomegoods.com',
    'https://www.ghhomegoods.com',
    'http://localhost',
    'http://127.0.0.1'
];

const RATE_LIMIT = 60;

// ============================================================================
// CORS HEADERS
// ============================================================================
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ALLOWED_ORIGINS) || strpos($origin, 'localhost') !== false) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: *"); // Fallback for testing
    }

    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
}
setCorsHeaders();

// ============================================================================
// HANDLE OPTIONS PRE-FLIGHT REQUEST
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// HEALTH CHECK (move this BEFORE main logic)
// ============================================================================
if (isset($_GET['health'])) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => GOOGLE_APPS_SCRIPT_URL,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['action' => 'verify_system']),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $healthy = ($httpCode === 200 && $response);

    echo json_encode([
        'status' => $healthy ? 'healthy' : 'unhealthy',
        'proxy_version' => '1.0',
        'google_apps_script' => [
            'http_code' => $httpCode,
            'responsive' => $healthy
        ],
        'timestamp' => date('c'),
        'server' => 'GHHomegoods Proxy'
    ]);
    exit;
}

// ============================================================================
// MAIN PROXY LOGIC
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.',
        'error_code' => 'METHOD_NOT_ALLOWED'
    ]);
    exit;
}

// ---------------------------------------------
// Optional: Simple Rate Limiting
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $file = sys_get_temp_dir() . '/ghhomegoods_rate_' . md5($ip);

    $requests = [];
    if (file_exists($file)) {
        $requests = json_decode(file_get_contents($file), true) ?: [];
    }

    $cutoff = time() - 60;
    $requests = array_filter($requests, fn($timestamp) => $timestamp > $cutoff);

    if (count($requests) >= RATE_LIMIT) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Rate limit exceeded.',
            'error_code' => 'RATE_LIMIT'
        ]);
        exit;
    }

    $requests[] = time();
    file_put_contents($file, json_encode($requests));
}
checkRateLimit();

// ---------------------------------------------
// Validate Input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request data',
        'error_code' => 'INVALID_JSON'
    ]);
    exit;
}

// Allowed actions
$allowedActions = [
    'place_order',
    'update_order_status',
    'get_orders',
    'get_admin_stats',
    'get_order_by_id',
    'lookup_customer_order',
    'verify_system'
];

if (!in_array($data['action'], $allowedActions)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid action',
        'error_code' => 'INVALID_ACTION'
    ]);
    exit;
}

// ---------------------------------------------
// Forward Request to Google Apps Script
try {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => GOOGLE_APPS_SCRIPT_URL,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $input,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'User-Agent: GHHomegoods-Proxy/1.0'
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError || $httpCode !== 200) {
        throw new Exception("Proxy forwarding failed. Error: $curlError, HTTP: $httpCode");
    }

    echo $response;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => 'PROXY_FORWARDING_ERROR'
    ]);
    exit;
}
?>
