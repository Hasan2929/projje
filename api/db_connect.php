<?php
// تفعيل الإبلاغ عن الأخطاء كاستثناءات
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// بدء الجلسة إذا لم تكن قد بدأت
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ====> الجزء الجديد والذكي <====
// الحصول على اسم الملف الذي قام باستدعاء هذا الملف
$calling_script = basename($_SERVER['PHP_SELF']);

// تغيير الهيدر إلى JSON فقط إذا لم يكن الملف هو wait.php أو أي ملف HTML آخر
if ($calling_script !== 'wait.php' && $calling_script !== 'download.php' && $calling_script !== 'index.php') {
    // التأكد من عدم إرسال الهيدر مسبقاً
    if (!headers_sent()) {
        header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json; charset=utf-8');
    }
}
// ===============================

// معلومات الاتصال
$servername = "localhost";
$username   = "u965090405_hasan";
$password   = "Hasan4525";
$dbname     = "u965090405_kurddown";
$conn = null; // تعريف المتغير مسبقاً

try {
    // محاولة الاتصال
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    
    // ضبط ترميز الاتصال
    mysqli_set_charset($conn, "utf8mb4");

} catch (Exception $e) {
    // في حالة فشل الاتصال
    if (!headers_sent()) {
        http_response_code(500);
        // نرسل هيدر JSON هنا يدوياً لأن الهيدر الرئيسي قد لا يكون قد أُرسل
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false, 
            'message' => 'Database connection error.', 
            'error_details' => $e->getMessage()
        ]);
    }
    // إيقاف التنفيذ لمنع أي أخطاء إضافية
    exit();
}

// إذا وصل الكود إلى هنا، فالاتصال ناجح.
?>