<?php
// 1. استدعاء ملف الاتصال والتحقق الأمني
require __DIR__ . '/db_connect.php';
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    // 2. التحقق من وجود program_id في الرابط
    if (!isset($_GET['program_id'])) {
        throw new Exception("Program ID is missing.", 400);
    }

    $programId = intval($_GET['program_id']);

    // 3. === الإصلاح الحاسم هنا ===
    // سنقوم بتحديد الأعمدة التي نريدها بالضبط، وسنقوم بإعادة تسميتها لتناسب JavaScript
    $sql = "SELECT 
                id,                  -- الأهم: جلب ID التعليق
                name AS author,      -- إعادة تسمية `name` إلى `author`
                comment AS text,     -- إعادة تسمية `comment` إلى `text`
                rating,              -- جلب التقييم
                created_at AS createdAt -- إعادة تسمية `created_at` إلى `createdAt`
            FROM comments 
            WHERE program_id = ? 
            ORDER BY created_at DESC";
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception("SQL statement preparation failed: " . $conn->error);
    }

    $stmt->bind_param("i", $programId);
    if (!$stmt->execute()) {
        throw new Exception("SQL statement execution failed: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $comments = [];
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        // تحويل الأعمدة الرقمية إلى أرقام لضمان التوافق
        $row['id'] = intval($row['id']);
        $row['rating'] = intval($row['rating']);
        $comments[] = $row;
      }
    }

    // 4. إرسال البيانات بصيغة JSON
    echo json_encode($comments);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // إرسال رد خطأ منظم في حال حدوث أي مشكلة
    $code = $e->getCode() > 0 ? $e->getCode() : 500;
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while fetching comments.',
        'error_details' => $e->getMessage()
    ]);
    if (isset($conn)) $conn->close();
}
?>