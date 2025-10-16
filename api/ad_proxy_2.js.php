<?php
// بروكسي للإعلان الثاني (Popunder)
header('Content-Type: application/javascript');
header('Access-Control-Allow-Origin: *');

$url = 'https://pl27697698.revenuecpmgate.com/df/58/4c/df584cd95f80cbf4c4f94eb3b43b1166.js';

// استخدام cURL لجلب المحتوى
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$output = curl_exec($ch);
curl_close($ch);

echo $output;
?>