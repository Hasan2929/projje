<?php
// === ملف لإنشاء حساب مدير جديد ===

// 1. استدعاء ملف الاتصال
require __DIR__ . '/db_connect.php';

// 2. التحقق من أن هذا الملف يتم تشغيله فقط من قبل مدير مسجل دخوله
// هذا إجراء أمني لمنع أي شخص من إنشاء حسابات
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    die('<h1>Unauthorized Access</h1><p>You must be logged in as an admin to run this script.</p>');
}

// 3. ==> ضع هنا بيانات المدير الجديد الذي تريد إضافته <==
$new_admin_email = 'saadnaaman@gmail.com';
$new_admin_password = 'KurdDown99$$';
// =========================================================

echo "<h1>Creating New Admin Account...</h1>";

// التحقق من أن البيانات ليست فارغة
if (empty($new_admin_email) || empty($new_admin_password) || $new_admin_email === 'newadmin@example.com') {
    die("<p style='color: red;'>Error: Please edit this file and set the \$new_admin_email and \$new_admin_password variables before running.</p>");
}

try {
    // 4. تشفير كلمة المرور
    $hashed_password = password_hash($new_admin_password, PASSWORD_DEFAULT);

    // 5. تجهيز استعلام الإدخال
    $stmt = $conn->prepare("INSERT INTO admins (email, password) VALUES (?, ?)");
    if ($stmt === false) {
        throw new Exception('Database prepare error: ' . $conn->error);
    }
    
    $stmt->bind_param("ss", $new_admin_email, $hashed_password);

    // 6. تنفيذ الاستعلام
    if ($stmt->execute()) {
        echo "<p style='color: green;'>Admin user '{$new_admin_email}' created successfully!</p>";
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // التعامل مع الأخطاء (مثل إذا كان البريد الإلكتروني موجوداً بالفعل)
    if (mysqli_errno($conn) == 1062) { // 1062 هو رمز خطأ "Duplicate entry"
        echo "<p style='color: orange;'>Admin user '{$new_admin_email}' already exists.</p>";
    } else {
        echo "<p style='color: red;'>Error creating admin: " . $e->getMessage() . "</p>";
    }
}

echo "<hr><p><strong>Important:</strong> Please delete this file (`create_admin.php`) from your server now for security reasons.</p>";
?>