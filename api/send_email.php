<?php
// تفعيل عرض الأخطاء للتشخيص أثناء التطوير
error_reporting(E_ALL);
ini_set('display_errors', 1);

// التحقق من أن الطلب هو POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

// استلام البيانات من الطلب
$name = trim($_POST['name'] ?? 'Anonymous');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? 'New Message from KURD DOWN');
$message = trim($_POST['message'] ?? '');

// التحقق من أن الحقول المطلوبة ليست فارغة
if (empty($email) || empty($message) || empty($subject) || empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'الرجاء ملء جميع الحقول المطلوبة.']);
    exit();
}

// التحقق من صحة البريد الإلكتروني
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني الذي أدخلته غير صالح.']);
    exit();
}

// --- الجزء الأهم: إعدادات إرسال البريد ---

// بريدك الاحترافي الذي ستستلم عليه الرسائل
$to = 'info@kurddown.store';

// تجهيز رأس الرسالة (Headers)
$headers = "From: KURD DOWN Contact Form <contact@kurddown.store>" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
$headers .= "MIME-Version: 1.0" . "\r\n";

// تجهيز محتوى الرسالة (يمكنك تصميمه كما تريد)
$email_body = "
<html>
<body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
    <h2 style='color: #4f46e5;'>رسالة جديدة من زائر لموقع KURD DOWN</h2>
    <p><strong>الاسم:</strong> {$name}</p>
    <p><strong>البريد الإلكتروني:</strong> {$email}</p>
    <p><strong>الموضوع:</strong> {$subject}</p>
    <hr>
    <p><strong>نص الرسالة:</strong></p>
    <p>" . nl2br(htmlspecialchars($message)) . "</p>
</body>
</html>
";

// إرسال البريد
if (mail($to, $subject, $email_body, $headers)) {
    // إذا نجح الإرسال
    echo json_encode(['success' => true, 'message' => 'تم إرسال رسالتك بنجاح! سنقوم بالرد في أقرب وقت.']);
} else {
    // إذا فشل الإرسال
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ ما أثناء محاولة إرسال الرسالة. الرجاء المحاولة مرة أخرى.']);
}

?>