<?php
// 1. استدعاء ملف الاتصال وبدء الجلسة
require __DIR__ . '/db_connect.php';

// 2. التحقق الأمني من أن المستخدم هو الأدمن
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// 3. التحقق من وجود ID البرنامج
if (!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Program ID is required.']);
    exit();
}

$programId = intval($_POST['id']);

// 4. حذف التعليقات المرتبطة بالبرنامج أولاً
$stmt = $conn->prepare("DELETE FROM comments WHERE program_id = ?");
$stmt->bind_param("i", $programId);
$stmt->execute();
$stmt->close();

// 5. حذف البرنامج من جدول programs
$stmt = $conn->prepare("DELETE FROM programs WHERE id = ?");
$stmt->bind_param("i", $programId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Program deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Program not found or already deleted.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete program: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>