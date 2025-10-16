<?php
// الخطوة 1: استخدام المسار المضمون للعثور على ملف الاتصال
require __DIR__ . '/db_connect.php';


// الخطوة 3: تنفيذ الاستعلام بعد التأكد من أن كل شيء آمن
$sql = "SELECT * FROM programs ORDER BY createdAt DESC";
$result = $conn->query($sql);

$programs = [];
if ($result && $result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $programs[] = $row;
  }
}

// إرسال البيانات (header موجود بالفعل في db_connect.php)
echo json_encode($programs);

$conn->close();
?>