<?php
// هذا الملف عام ولا يتطلب تسجيل دخول
require __DIR__ . '/db_connect.php';

// لا نحتاج لمعرف برنامج محدد هنا، نريد كل البرامج
$stmt = $conn->prepare("SELECT * FROM programs");
$stmt->execute();
$result = $stmt->get_result();

$programs = [];
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $programs[] = $row;
  }
  echo json_encode($programs);
} else {
  // إذا لم يتم العثور على برامج، أرجع مصفوفة فارغة بدلاً من 404
  echo json_encode([]);
}

$stmt->close();
$conn->close();
?>

