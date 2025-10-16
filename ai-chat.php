
?><!DOCTYPE html>
<html lang="ku" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KURD AI</title>
  <link rel="stylesheet" href="styles/ai-chat.css?v=<?php echo time(); ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
<script type="importmap">
{
  "imports": {
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.17.0",
    "react/": "https://aistudiocdn.com/react@^19.1.1/",
    "react": "https://aistudiocdn.com/react@^19.1.1",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.1.1/"
  }
}
</script>
</head>
<body>
    <div id="page-transition-overlay"></div>
  <div id="root"></div>
      <!-- ... (الكود الموجود لديك) ... -->
    <!-- AI Chat App Script -->
    <script type="module" src="/js/ai-chat.js"></script>

    <!-- ========  أضف هذا الكود الجديد هنا  ======== -->
    <script>
        function setRealViewportHeight() {
            // نقيس الارتفاع الداخلي للنافذة المتاح بالفعل
            let vh = window.innerHeight * 0.01;
            // ننشئ متغيراً جديداً في CSS اسمه --vh
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        // نقوم بتشغيل الدالة عند تحميل الصفحة
        setRealViewportHeight();

        // ونقوم بتشغيلها أيضاً كلما تغير حجم الشاشة (مثل عند تدوير الهاتف)
        window.addEventListener('resize', setRealViewportHeight);
    </script>
    <!-- ============================================== -->
    <script>
// تعطيل زر الماوس الأيمن
document.addEventListener('contextmenu', function(e) {
e.preventDefault();
});
// تعطيل اختصارات لوحة المفاتيح الشائعة
document.addEventListener('keydown', function(e) {
// F12
if (e.keyCode == 123) { e.preventDefault(); }
// Ctrl+Shift+I
if (e.ctrlKey && e.shiftKey && e.keyCode == 73) { e.preventDefault(); }
// Ctrl+Shift+C
if (e.ctrlKey && e.shiftKey && e.keyCode == 67) { e.preventDefault(); }
// Ctrl+Shift+J
if (e.ctrlKey && e.shiftKey && e.keyCode == 74) { e.preventDefault(); }
// Ctrl+U
if (e.ctrlKey && e.keyCode == 85) { e.preventDefault(); }
});
</script>

<!-- ======================================================== -->
<!-- ===        شريط التنقل السفلي الجديد للموبايل        === -->
<!-- ======================================================== -->
<!-- ======================================================== -->
<!-- ===   شريط التنقل السفلي المطور (مع المؤشر السحري)   === -->
<!-- ======================================================== -->
<nav class="mobile-tab-bar">
    <a href="index.php" class="tab-item" data-page="index">
        <i class="fas fa-home"></i>
        <span>سەرەکی</span>
    </a>
    <a href="games.php" class="tab-item" data-page="games">
        <i class="fas fa-gamepad"></i>
        <span>یارییەکان</span>
    </a>
    <a href="software.php" class="tab-item" data-page="software">
        <i class="fas fa-laptop-code"></i>
        <span>بەرنامە</span>
    </a>
    <a href="ai-chat.php" class="tab-item" data-page="ai-chat">
        <i class="fas fa-robot"></i>
        <span>KURD AI</span>
    </a>
    <!-- ▼▼▼ العنصر الجديد والمهم ▼▼▼ -->
    
</nav>

</body>
</html>