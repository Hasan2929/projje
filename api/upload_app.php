<?php
// =======================================================================
// File: public_html/api/upload_app.php
// Description: Handles uploading of .apk and .ipa files to the local server
// =======================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$uploadDir = __DIR__ . "/../uploads/apps/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

if (!isset($_FILES["file"])) {
    echo json_encode(["success" => false, "message" => "لم يتم استلام أي ملف"]);
    exit;
}

$file = $_FILES["file"];
$allowedExtensions = ["apk", "ipa"];
$extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    echo json_encode(["success" => false, "message" => "نوع الملف غير مسموح. فقط APK و IPA"]);
    exit;
}

if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "حدث خطأ أثناء رفع الملف"]);
    exit;
}

$newFileName = uniqid("app_") . "." . $extension;
$destination = $uploadDir . $newFileName;

if (move_uploaded_file($file["tmp_name"], $destination)) {
    $fileUrl = "https://" . $_SERVER["HTTP_HOST"] . "/uploads/apps/" . $newFileName;
    echo json_encode(["success" => true, "url" => $fileUrl]);
} else {
    echo json_encode(["success" => false, "message" => "فشل حفظ الملف في السيرفر"]);
}
?>
