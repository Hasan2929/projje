<?php
// تفعيل عرض الأخطاء للتشخيص
error_reporting(E_ALL);
ini_set('display_errors', 1);

// إعداد الهيدر
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

$apiKey = "AIzaSyCqzjutW6zFGGTQFhThCLTwZ-9GKq934uU"; // <--- مفتاحك هنا

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['prompt']) || !isset($input['language'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Prompt and language are required.']);
    exit();
}

$prompt = $input['prompt'];
$language = $input['language'];

// ==========================================================
// ===   الجزء المُحسّن: تعليمات أكثر صرامة ودقة للـ AI   ===
// ==========================================================
$systemInstruction = '';
if ($language === 'sorani') {
    $systemInstruction = 'You are KURD AI, a specialized AI assistant. Your primary and ONLY function is to communicate in the Kurdish Sorani dialect, using the Arabic script. Under no circumstances should you ever use any other language or dialect, including English, Arabic, or Badini. Your entire response must be in Sorani. If a user asks you something in another language, you must still answer in Sorani.';
} elseif ($language === 'badini') {
    $systemInstruction = 'You are KURD AI, a specialized AI assistant. Your primary and ONLY function is to communicate in the Kurdish Badini dialect, using the Arabic script. Under no circumstances should you ever use any other language or dialect, including English, Arabic, or Sorani. Your entire response must be in Badini. If a user asks you something in another language, you must still answer in Badini.';
} else {
    // لغة افتراضية (سورانية) في حال حدوث خطأ
    $systemInstruction = 'You are KURD AI. You must respond exclusively in the Kurdish Sorani dialect.';
}


// تجهيز الطلب
$googleApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

$requestBody = [
    'contents' => [
        ['role' => 'user', 'parts' => [['text' => $prompt]]]
    ],
    'systemInstruction' => [
        'role' => 'system',
        'parts' => [['text' => $systemInstruction]]
    ],
    // إضافة إعدادات أمان لمنع الردود غير المرغوبة
    'safetySettings' => [
        ['category' => 'HARM_CATEGORY_HARASSMENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
        ['category' => 'HARM_CATEGORY_HATE_SPEECH', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
        ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
        ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
    ],
    // إعدادات لتشجيع الرد الإبداعي والدقيق
    'generationConfig' => [
        'temperature' => 0.7,
        'topK' => 1,
        'topP' => 1,
        'maxOutputTokens' => 2048,
    ]
];

// إرسال الطلب (cURL) - يبقى كما هو
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $googleApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response_body = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// التحقق من الأخطاء وإعادة إرسال الرد (يبقى كما هو)
if ($curl_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'cURL Error: ' . $curl_error]);
    exit();
}
if ($http_code !== 200) {
    http_response_code($http_code);
    $errorDetails = json_decode($response_body, true);
    echo json_encode([
        'success' => false, 
        'message' => 'Error from Google API: ' . ($errorDetails['error']['message'] ?? 'Unknown error')
    ]);
    exit();
}

echo $response_body;
?>