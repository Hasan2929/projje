<?php
require __DIR__ . '/db_connect.php'; // استدعاء ملف الاتصال

try {
    // التحقق من وجود program_id في الرابط
    if (!isset($_GET['program_id'])) {
        throw new Exception("Program ID is missing.", 400);
    }

    $programId = intval($_GET['program_id']);

    // استخدام اسم العمود الصحيح `created_at`
    $sql = "SELECT id, name AS author, comment AS text, rating, created_at AS createdAt FROM comments WHERE program_id = ? ORDER BY created_at DESC";
    
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
        $comments[] = $row;
      }
    }

    echo json_encode($comments); // إرسال مصفوفة التعليقات

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // إرسال رد خطأ منظم بصيغة JSON
    http_response_code($e->getCode() > 0 ? $e->getCode() : 500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while fetching comments.',
        'error_details' => $e->getMessage()
    ]);
    if (isset($conn)) $conn->close();
}
?>