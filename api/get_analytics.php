<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// التحقق من أن المستخدم هو "الأدمن" المسجل دخوله
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// استدعاء ملف الاتصال
require __DIR__ . '/db_connect.php';

try {
    // حساب إجمالي التحميلات
    $sql_total = "SELECT SUM(downloads) as total FROM programs";
    $result_total = $conn->query($sql_total);
    
    if (!$result_total) {
        throw new Exception('فشل في جلب إجمالي التحميلات: ' . $conn->error);
    }
    
    $row_total = $result_total->fetch_assoc();
    $totalDownloads = $row_total['total'] ? intval($row_total['total']) : 0;

    // جلب البرامج الأكثر تحميلاً
    $sql_top = "SELECT id, name, mainCategory, category, image, downloads FROM programs ORDER BY downloads DESC LIMIT 20";
    $result_top = $conn->query($sql_top);
    
    if (!$result_top) {
        throw new Exception('فشل في جلب البرامج الأكثر تحميلاً: ' . $conn->error);
    }

    $topPrograms = array();
    if ($result_top->num_rows > 0) {
        while($row = $result_top->fetch_assoc()) {
            // تحويل downloads إلى رقم صحيح
            $row['downloads'] = intval($row['downloads']);
            $topPrograms[] = $row;
        }
    }

    $analyticsData = [
        'totalDownloads' => $totalDownloads,
        'topPrograms' => $topPrograms
    ];

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($analyticsData);

} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
}
?>