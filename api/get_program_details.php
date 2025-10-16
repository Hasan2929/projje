<?php
// 1. استدعاء ملف الاتصال
require __DIR__ . '/db_connect.php';

// 2. التحقق الأمني (هذا الملف يجب أن يكون محمياً)
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// 3. التحقق من وجود ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Program ID is required.']);
    exit();
}

$programId = intval($_GET['id']);

try {
    // 4. تجهيز الاستعلام
    $stmt = $conn->prepare("SELECT * FROM programs WHERE id = ?");
    if ($stmt === false) {
        throw new Exception('Database prepare error: ' . $conn->error);
    }

    $stmt->bind_param("i", $programId);
    $stmt->execute();
    $result = $stmt->get_result();

    // 5. إرجاع النتيجة
    if ($result->num_rows > 0) {
        $program = $result->fetch_assoc();
        // التأكد من أن الحقول الرقمية هي أرقام
        $program['id'] = intval($program['id']);
        $program['featured'] = (bool)$program['featured'];
        $program['downloads'] = intval($program['downloads']);
        echo json_encode($program);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Program not found.']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>