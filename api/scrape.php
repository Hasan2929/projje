<?php
// استدعاء المكتبة والأدوات اللازمة
require_once __DIR__ . '/simple_html_dom.php';

// بدء الجلسة والتحقق الأمني
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    http_response_code(403);
    die('Unauthorized');
}

// إعدادات
set_time_limit(300);
ignore_user_abort(true);

// === **تم تحديث مفتاح API هنا** ===
$api_key = '460e7d033d69d908f918cf20c9c53f2c';
// ===================================

$base_url = 'https://dodi-repacks.site/page/';

// قراءة رقم الصفحة من الرابط
$page_to_scrape = isset($_GET['page']) ? intval($_GET['page']) : 1;
if ($page_to_scrape <= 0) $page_to_scrape = 1;

$target_url = $base_url . $page_to_scrape . '/';

echo "<h1>Scraping a Single Page from DODI Repacks...</h1>";
echo "<h2>Targeting Page: {$page_to_scrape}</h2>";
echo "<p>URL: {$target_url}</p><hr>";
ob_flush(); flush();

// استخدام ScraperAPI مع تفعيل JavaScript
$scraper_api_url = "http://api.scraperapi.com?api_key={$api_key}&url=" . urlencode($target_url) . "&render=true";
$response_html = @file_get_contents($scraper_api_url);

if ($response_html === false || empty($response_html)) {
    die("<p style='color:red;'>Failed to retrieve content for page {$page_to_scrape}. Check ScraperAPI credits or if the site is blocking the request.</p>");
}

$html = str_get_html($response_html);
if (!$html) {
    die("<p style='color:red;'>Could not parse the HTML content.</p>");
}

$all_items_found = [];
$items_on_this_page = 0;
// التحليل المخصص لموقع DODI
foreach ($html->find('article.post') as $article) {
    $title_element = $article->find('h2.entry-title a', 0);
    $image_element = $article->find('div.post-thumbnail img', 0);

    if ($title_element && $image_element) {
        $name = trim($title_element->plaintext);
        $link = $title_element->href;
        $image = $image_element->{'data-src'} ?? $image_element->src;

        if (!empty($name) && !empty($link) && !empty($image)) {
            // التصنيف التلقائي
            $mainCategory = 'games';
            $category = 'PC';
            $software_keywords = ['windows', 'office', 'adobe', 'autodesk', 'software'];
            foreach ($software_keywords as $keyword) {
                if (stripos($name, $keyword) !== false) {
                    $mainCategory = 'software';
                    $category = 'system';
                    break;
                }
            }
            $all_items_found[] = [
                'name' => $name, 'image' => $image, 'link' => $link,
                'mainCategory' => $mainCategory, 'category' => $category
            ];
            $items_on_this_page++;
        }
    }
}

echo "<p style='color:green;'>Found {$items_on_this_page} items on this page.</p>";
$html->clear(); unset($html);

// --- حفظ البيانات في قاعدة البيانات ---
if (!empty($all_items_found)) {
    require_once __DIR__ . '/db_connect.php';
    if ($conn->connect_error) die("<p style='color:red;'>Failed to connect to database.</p>");

    $check_stmt = $conn->prepare("SELECT id FROM programs WHERE name = ?");
    $insert_stmt = $conn->prepare("INSERT INTO programs (name, image, downloadUrl, mainCategory, category) VALUES (?, ?, ?, ?, ?)");

    if ($check_stmt === false || $insert_stmt === false) die('MySQL prepare error: ' . $conn->error);
    
    $new_items_count = 0;
    foreach ($all_items_found as $item) {
        $check_stmt->bind_param("s", $item['name']);
        $check_stmt->execute();
        $result = $check_stmt->get_result();

        if ($result->num_rows == 0) {
            $insert_stmt->bind_param("sssss", $item['name'], $item['image'], $item['link'], $item['mainCategory'], $item['category']);
            if ($insert_stmt->execute()) {
                $new_items_count++;
            }
        }
    }
    
    $check_stmt->close();
    $insert_stmt->close();
    $conn->close();

    echo "<hr><h1>Finished!</h1><p>Successfully added " . $new_items_count . " new items to the database.</p>";
} else {
    echo "<hr><h1>Finished</h1><p>No new items were found on this page.</p>";
}
?>