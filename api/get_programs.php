<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. التحقق من أن المستخدم هو "الأدمن" المسجل دخوله
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403); // Forbidden
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}
require __DIR__ . '/db_connect.php'; // إصلاح المسار

// التحقق الأمني
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$sql = "SELECT * FROM programs ORDER BY createdAt DESC";
$result = $conn->query($sql);

$programs = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    // تحويل قيمة featured إلى boolean حقيقية
    $row['featured'] = (bool)$row['featured'];
    $programs[] = $row;
  }
}

echo json_encode($programs);

$conn->close();
?>