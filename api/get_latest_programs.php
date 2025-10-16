<?php
// ضمان أن الرد سيكون دائمًا JSON
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/db_connect.php'; // إصلاح المسار

// التحقق الأمني
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
} // استدعاء ملف الاتصال الموحد

try {
    // التحقق من أن المستخدم مسجل دخوله
    if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
        throw new Exception('Unauthorized', 403);
    }

    $sql = "SELECT id, name, mainCategory, image FROM programs ORDER BY createdAt DESC LIMIT 5";
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception('SQL query failed: ' . $conn->error);
    }

    $programs = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $programs[] = $row;
        }
    }
    
    // إرسال البيانات بنجاح
    echo json_encode($programs);

} catch (Exception $e) {
    // إرسال رسالة خطأ منظمة بصيغة JSON
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>