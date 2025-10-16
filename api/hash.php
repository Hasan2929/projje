<?php
require __DIR__ . '/db_connect.php'; // إصلاح المسار

// التحقق الأمني
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
} // تأكد من الاتصال بقاعدة البيانات

// بيانات المستخدم الجديد
$email = 'besthasoni29@gmail.com';
$plain_password = 'admin123';

// تشفير كلمة المرور
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

// استعلام الإدخال باستخدام Prepared Statement لحماية من الحقن
$stmt = $conn->prepare("INSERT INTO admins (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    echo "User added successfully!";
} else {
    echo "Error: " . $stmt->error;
}
