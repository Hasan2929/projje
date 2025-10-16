<?php
// لا نحتاج session_start() هنا لأن db_connect سيقوم بذلك
// استخدام __DIR__ هو الإصلاح الأهم لضمان العثور على الملف
require __DIR__ . '/db_connect.php';

// التحقق من أن الطلب هو POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان.']);
    exit();
}

$email = $data['email'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT * FROM admins WHERE email = ?");
if (!$stmt) {
    // هذا الخطأ يظهر إذا كان هناك مشكلة في جملة SQL نفسها
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطأ في تجهيز استعلام قاعدة البيانات.']);
    exit();
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // التحقق من تطابق كلمة المرور المشفرة
    if (password_verify($password, $user['password'])) {
        // نجح تسجيل الدخول، قم بتسجيل الجلسة
        $_SESSION['is_logged_in'] = true;
        $_SESSION['admin_email'] = $user['email']; // إضافة مفيدة للجلسة
        
        echo json_encode(['success' => true, 'message' => 'تم تسجيل الدخول بنجاح.']);
        
    } else {
        // كلمة المرور خاطئة
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'كلمة المرور التي أدخلتها غير صحيحة.']);
    }
} else {
    // البريد الإلكتروني غير موجود
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'هذا البريد الإلكتروني غير مسجل كمدير.']);
}

$stmt->close();
$conn->close();
?>