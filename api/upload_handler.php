<?php
// تفعيل عرض الأخطاء للتشخيص
error_reporting(E_ALL);
ini_set('display_errors', 1);

// بدء الجلسة والتحقق الأمني
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized Access']);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

// المسار الذي سيتم حفظ الملفات فيه (خارج مجلد api)
// __DIR__ هو مجلد api الحالي, ../ يعني الرجوع للخلف خطوة واحدة
$targetDir = __DIR__ . "/../uploads/apps/";

// التأكد من وجود المجلد، وإن لم يكن موجوداً يتم إنشاؤه
if (!file_exists($targetDir)) {
    // 0777 يعطي صلاحيات كاملة، وهو مناسب لمعظم الاستضافات المشتركة
    if (!mkdir($targetDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory.']);
        exit();
    }
}

// التحقق من وجود ملف مرفوع
if (!isset($_FILES["file"]) || $_FILES["file"]["error"] != 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error occurred.']);
    exit();
}

// تنظيف اسم الملف من أي رموز خطيرة
$fileName = basename($_FILES["file"]["name"]);
$safeFileName = preg_replace("/[^a-zA-Z0-9-_\.\(\)]/", "", $fileName);
$targetFilePath = $targetDir . $safeFileName;
$fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

// تحديد الامتدادات المسموح بها
$allowedTypes = array('apk', 'ipa', 'zip', 'rar');

if (in_array($fileType, $allowedTypes)) {
    // محاولة نقل الملف المرفوع إلى المجلد النهائي
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        
        // ===> الجزء الأهم: إنشاء رابط URL يمكن الوصول إليه من المتصفح <===
        // نحصل على بروتوكول الموقع (http أو https)
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        // نحصل على اسم النطاق
        $domainName = $_SERVER['HTTP_HOST'];
        // نجمع الرابط الكامل
        $fileUrl = $protocol . $domainName . '/uploads/apps/' . $safeFileName;
        
        echo json_encode([
            "success" => true, 
            "message" => "تم رفع الملف بنجاح!",
            "secure_url" => $fileUrl // نستخدم نفس اسم الحقل الذي تتوقعه Cloudinary
        ]);

    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'فشل حفظ الملف على السيرفر. قد تكون هناك مشكلة في الصلاحيات.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => "امتداد الملف '{$fileType}' غير مسموح به. مسموح فقط بـ: " . implode(', ', $allowedTypes)]);
}
?>