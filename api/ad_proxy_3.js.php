<?php
// بروكسي للإعلان الثالث (Social Bar)
header('Content-Type: application/javascript');
header('Access-Control-Allow-Origin: *');

$url = 'https://pl27697680.revenuecpmgate.com/98/75/c5/9875c5aa4c40d09a8e658d129d157cb8.js';

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