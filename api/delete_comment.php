<?php
// 1. استدعاء ملف الاتصال وبدء الجلسة
require __DIR__ . '/db_connect.php';

// 2. التحقق الأمني من أن المستخدم هو الأدمن
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// 3. التحقق من أن الطلب هو POST وأن الـ ID موجود
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['id']) || empty($_POST['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Comment ID is required and method must be POST.']);
    exit();
}

$commentId = intval($_POST['id']);

if ($commentId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid Comment ID.']);
    exit();
}

// 4. تجهيز وتنفيذ أمر الحذف من جدول التعليقات
$stmt = $conn->prepare("DELETE FROM comments WHERE id = ?");
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database prepare error.']);
    exit();
}

$stmt->bind_param("i", $commentId);

if ($stmt->execute()) {
    // التحقق مما إذا تم حذف أي صف
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'تم حذف التعليق بنجاح.']);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'لم يتم العثور على التعليق أو تم حذفه بالفعل.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'فشل في تنفيذ أمر الحذف: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>