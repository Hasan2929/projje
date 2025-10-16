<?php
// 1. بدء الجلسة والتحقق الأمني
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// 2. استدعاء ملف الاتصال
require __DIR__ . '/db_connect.php';

try {
    // --- استقبال البيانات من الفورم ---
    $name = $_POST['name'] ?? '';
    $mainCategory = $_POST['mainCategory'] ?? '';
    $description = $_POST['description'] ?? '';
    $version = $_POST['version'] ?? 'N/A';
    $size = $_POST['size'] ?? 'N/A';
    $image = $_POST['image'] ?? '';
    $downloadUrl = $_POST['downloadUrl'] ?? '';
    $downloadUrl2 = $_POST['downloadUrl2'] ?? '';
    $videoUrl = $_POST['videoUrl'] ?? '';
    $featured = isset($_POST['featured']) && $_POST['featured'] == 'on' ? 1 : 0;

    // التحقق من الحقول الإلزامية
    if (empty($name) || empty($mainCategory)) {
        throw new Exception('الاسم والتصنيف الرئيسي حقول إلزامية.');
    }

    // ====> الجزء الجديد والأهم: تحديد الفئة (Category) بذكاء <====
    $category = '';
    if ($mainCategory === 'games') {
        $category = $_POST['game_category'] ?? 'PC';
    } else if ($mainCategory === 'software') {
        $category = $_POST['software_category'] ?? 'system';
    } else if ($mainCategory === 'android' || $mainCategory === 'ios') {
        // هنا نستقبل الفئة من حقل 'category' مباشرة
        $category = $_POST['category'] ?? 'tools'; 
    }

    // --- تجهيز وحفظ البيانات ---
    $sql = "INSERT INTO programs 
            (name, mainCategory, category, version, description, image, size, downloadUrl, downloadUrl2, videoUrl, featured) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Database prepare error: ' . $conn->error);
    }

    $stmt->bind_param(
        "ssssssssssi", 
        $name, $mainCategory, $category, $version, $description, 
        $image, $size, $downloadUrl, $downloadUrl2, $videoUrl, $featured
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'تمت إضافة العنصر بنجاح.']);
    } else {
        throw new Exception('Failed to add item: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
}
?>