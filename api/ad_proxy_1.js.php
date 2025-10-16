<?php
// بروكسي للإعلان الأول (Native Banner Script)
header('Content-Type: application/javascript');
header('Access--Control-Allow-Origin: *');

$url = 'https://pl27697763.revenuecpmgate.com/9c5380debdd5f5ec178fed5c16a5bea1/invoke.js';

// استخدام cURL لجلب المحتوى بشكل احترافي
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'); // محاكاة متصفح
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // متابعة أي عمليات إعادة توجيه

$output = curl_exec($ch);
curl_close($ch);

echo $output;
?>