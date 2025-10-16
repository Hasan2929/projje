<?php
require __DIR__ . '/db_connect.php'; // استدعاء ملف الاتصال

try {
    // استلام البيانات بصيغة JSON
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON received.', 400);
    }

    // التحقق من وجود كل البيانات المطلوبة
    $required_fields = ['programId', 'text', 'author', 'rating'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field])) {
            throw new Exception("Missing required field: {$field}", 400);
        }
    }

    // تنظيف وتجهيز المتغيرات
    $programId = intval($data['programId']);
    $name = trim(htmlspecialchars($data['author']));
    $comment_text = trim(htmlspecialchars($data['text']));
    $rating = intval($data['rating']);

    if (empty($comment_text) || empty($name)) {
        throw new Exception('Name and comment text cannot be empty.', 400);
    }

    // استخدام الأسماء الصحيحة للأعمدة في قاعدة البيانات (name, comment)
    $stmt = $conn->prepare("INSERT INTO comments (program_id, name, comment, rating) VALUES (?, ?, ?, ?)");
    if ($stmt === false) {
        throw new Exception('Prepare statement failed: ' . $conn->error);
    }
    
    $stmt->bind_param("issi", $programId, $name, $comment_text, $rating);

    if (!$stmt->execute()) {
        throw new Exception('Failed to save comment: ' . $stmt->error);
    }
    
    $newCommentId = $conn->insert_id;

    // إرسال الرد إلى JavaScript بالأسماء التي يتوقعها
    echo json_encode([
        'success' => true,
        'comment' => [
            'id' => $newCommentId,
            'author' => $name,
            'text' => $comment_text,
            'rating' => $rating,
            'createdAt' => date('Y-m-d H:i:s') // إرسال تاريخ الإضافة
        ]
    ]);

    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(is_numeric($e->getCode()) && $e->getCode() > 0 ? $e->getCode() : 500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>