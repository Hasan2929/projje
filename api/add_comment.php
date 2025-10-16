<?php
require __DIR__ . '/db_connect.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON received.', 400);
    }

    // البيانات المطلوبة من JavaScript
    $programId = intval($data['programId']);
    $authorName = trim(htmlspecialchars($data['author'])); // الاسم الذي يكتبه المستخدم
    $commentText = trim(htmlspecialchars($data['text'])); // نص التعليق الذي يكتبه المستخدم
    $rating = intval($data['rating']);

    if (empty($commentText) || empty($authorName)) {
        throw new Exception('Name and comment text cannot be empty.', 400);
    }

    // **الإصلاح الحاسم**: استخدام الأسماء الصحيحة للأعمدة كما هي في الصورة
    // (program_id, name, comment, rating)
    $stmt = $conn->prepare("INSERT INTO comments (program_id, name, comment, rating) VALUES (?, ?, ?, ?)");
    if ($stmt === false) {
        throw new Exception('Prepare statement failed: ' . $conn->error);
    }
    
    // ربط المتغيرات بالترتيب الصحيح (id, name, comment, rating)
    $stmt->bind_param("issi", $programId, $authorName, $commentText, $rating);

    if (!$stmt->execute()) {
        throw new Exception('Failed to save comment: ' . $stmt->error);
    }
    
    // إرسال الرد إلى JavaScript بالأسماء التي يتوقعها
    echo json_encode([
        'success' => true,
        'comment' => [
            'author' => $authorName, // نرسل القيمة تحت اسم author
            'text' => $commentText,   // نرسل القيمة تحت اسم text
            'rating' => $rating,
            'createdAt' => date('Y-m-d H:i:s')
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