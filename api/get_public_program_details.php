<?php
// هذا الملف عام ولا يتطلب تسجيل دخول
require __DIR__ . '/db_connect.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Program ID is required']);
    exit();
}

$programId = intval($_GET['id']);
$stmt = $conn->prepare("SELECT * FROM programs WHERE id = ?");
$stmt->bind_param("i", $programId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $program = $result->fetch_assoc();
  echo json_encode($program);
} else {
  http_response_code(404);
  echo json_encode(['success' => false, 'message' => 'Program not found']);
}

$stmt->close();
$conn->close();
?>