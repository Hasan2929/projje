<?php
session_unset();
session_destroy();
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['success' => true]);

// ... (كود حذف الجلسة) ...
header('Location: ../admin.php');
exit();

?>