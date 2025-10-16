<?php
// هذا الملف لا يتطلب تسجيل دخول
require __DIR__ . '/db_connect.php';

// التأكد من أن الطلب يحتوي على ID رقمي صحيح
if (!isset($_GET['id']) || !is_numeric($_GET['id']) || $_GET['id'] <= 0) {
    http_response_code(400); // Bad Request
    // لا نغير الهيدر إلى JSON هنا لأنه ملف بسيط
    exit('Error: Program ID is required and must be a valid number.');
}

$programId = intval($_GET['id']);

try {
    // استعلام لزيادة عدد التحميلات بمقدار 1
    $sql = "UPDATE programs SET downloads = downloads + 1 WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception("Database prepare error: " . $conn->error);
    }

    $stmt->bind_param("i", $programId);
    
    if ($stmt->execute()) {
        // تم التحديث بنجاح
        echo json_encode(['success' => true]);
    } else {
        throw new Exception("Failed to update download count: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    // يمكن تسجيل الخطأ في ملف logs إذا أردت
    // error_log($e->getMessage());
    exit('Error processing request.');
}
?>