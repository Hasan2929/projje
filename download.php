
<!DOCTYPE html>
<html lang="ku" dir="rtl">
<head>
    <!-- ============== Meta Tags & Title ============== -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Download page for KURD DOWN">
    <title>داگرتنی بەرنامە - KURD DOWN</title>
    
    <!-- ============== Favicon (Updated Path) ============== -->
    <link rel="icon" type="image/png" href="images/favicon.png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- NProgress Loading Bar CSS & JS -->
<link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css"/>
<script src="https://unpkg.com/nprogress@0.2.0/nprogress.js"></script>

    <!-- ============== Stylesheets ============== -->
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/download.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2399127081177956"
     crossorigin="anonymous"></script>
     
     <!-- === التحميل الذكي لملفات CSS === -->
    <?php if ($isMobile): ?>
        <link rel="stylesheet" href="styles/mobile.css?v=PRO_MAX_DL"> <!-- تصميم الموبايل الأساسي -->
        <link rel="stylesheet" href="styles/download-mobile.css?v=PRO_MAX_DL">
    <?php else: ?>
        <link rel="stylesheet" href="styles/main.css?v=PRO_MAX_DL">
        <link rel="stylesheet" href="styles/download.css?v=PRO_MAX_DL">
    <?php endif; ?>
    
    
    
    
    
    
</head>

<body data-page-title="download_page_title">
    <div id="particles-js"></div>

<!-- ========================================================== -->
<!-- ===   الهيدر والقائمة الجانبية الموحدة لكل الصفحات   === -->
<!-- ========================================================== -->

<!-- 1. القائمة الجانبية (فارغة، سيملؤها JavaScript) -->
<aside class="sidebar" id="sidebarMenu"></aside>
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<!-- 2. الهيدر (يحتوي فقط على العناصر الأساسية) -->
<header class="header">
    <div class="container">
        <div class="header-content">
            <!-- زر القائمة الجانبية -->
            <div class="header-right">
                <button class="menu-toggle" id="menuToggle">
                    <span></span><span></span><span></span>
                </button>
                <!-- الروابط ستكون في القائمة الجانبية، لا حاجة لها هنا -->
            </div>
    
            <!-- الشعار في الوسط -->
            <div class="header-center">
                <div class="logo animated-logo site-name-center">
                    <i class="fas fa-download"></i>
                    <span class="site-name-text">KURD DOWN</span>
                </div>
            </div>
    
            <!-- البحث على اليسار (سيعمل تلقائياً) -->
            <div class="header-left">
                <div id="search-wrapper">
                    <!-- المحتوى هنا يتم إنشاؤه بواسطة CSS و JS إذا لزم الأمر -->
                </div>
                <div id="searchResultsDropdown"></div>
            </div>
        </div>
    </div>
</header>
    
    <!-- ============== Main Content ============== -->
    <main class="main-content">
        <section class="download-section">
            <div class="container">
                <div id="loader" class="loading-state"><i class="fas fa-spinner fa-spin"></i><p data-translate="loading_details">...چاوەڕوانی وردەکاریی پرۆگرام</p></div>
                
                <div id="download-content" class="download-wrapper hidden">
                    <div class="program-header">
                        <img id="program-icon" src="" alt="ئایکۆنی بەرنامە" class="program-icon">
                        <div class="program-title-group">
                            <h1 id="program-name"></h1>
                            <p class="platform-badge"><i id="platform-icon" class="fab fa-windows"></i><span id="program-platform">Windows</span></p>
                        </div>
                    </div>
                    <div class="download-grid">
                        <div class="program-details">
                            <h2 data-translate="about_program"><i class="fas fa-info-circle"></i> دەربارەی بەرنامە</h2>
                            <p id="program-description"></p>
                            <div class="details-list">
                                <div class="detail-item"><i class="fas fa-tag"></i><strong data-translate="version"></strong>: <span id="program-version"></span></div>
                                <div class="detail-item"><i class="fas fa-hdd"></i><strong data-translate="size"></strong>: <span id="program-size"></span></div>
                                <div class="detail-item"><i class="fas fa-download"></i><strong data-translate="total_downloads"></strong>: <span id="program-downloads"></span></div>
                                <div class="detail-item"><i class="fas fa-folder"></i><strong data-translate="category"></strong>: <span id="program-category"></span></div>
                            </div>
                            <div id="videoContainer" class="video-container" style="display: none;">
                                <h3 data-translate="video_trailer">فيديو توضيحي</h3>
                                <div class="video-wrapper"><iframe id="programVideo" src="" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                            </div>
                        </div>

<!-- =========== قسم التقييم بالنجوم (جديد) =========== -->
<!-- =========== قسم التقييم بالنجوم (معدل للترجمة) =========== -->
<div class="rating-section">
    <h3 data-translate="rate_this_item"></h3>
    <div class="stars-container" id="stars-container">
        <i class="far fa-star" data-value="1"></i>
        <i class="far fa-star" data-value="2"></i>
        <i class="far fa-star" data-value="3"></i>
        <i class="far fa-star" data-value="4"></i>
        <i class="far fa-star" data-value="5"></i>
    </div>
    <p class="rating-feedback" id="rating-feedback"></p>
</div>

<!-- =========== قسم التعليقات (معدل للترجمة) =========== -->
<div class="comments-section">
    <h3 data-translate="comments_section_title">التعليقات (<span id="comments-count">0</span>)</h3>
    
    <div class="comment-form">
        <textarea id="comment-input" data-translate="comment_placeholder" rows="3"></textarea>
        <input type="text" id="comment-name-input" data-translate="name_placeholder">
        <button id="submit-comment-btn" data-translate="post_comment_btn"></button>
    </div>
    
    <div class="comments-list" id="comments-list">
        <!-- التعليقات سيتم تحميلها هنا -->
    </div>
</div>

                        <div class="download-box">
                            <h2 data-translate="direct_download"><i class="fas fa-download"></i> لینکی داگرتنی ڕاستەوخۆ</h2>
                            <p data-translate="click_to_download">بۆ دەستپێکردنی داگرتن کرتە لە دوگمەی خوارەوە بکە.</p>
                            <div class="download-button-container" id="downloadButtonContainer"><label class="label" onclick="handleDownloadClick(this)"><input type="checkbox" class="input" id="download-checkbox"/><span class="circle"><svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19V5m0 14-4-4m4 4 4-4"></path></svg><div class="square"></div></span><p class="title" id="download-text-initial" data-translate="download_now">داگرتن</p><p class="title" id="download-text-done" data-translate="download_done">داگیرا!</p><p class="title" id="download-text-disabled" data-translate="no_link">لینک نییە</p></label></div>
                            <a href="#" id="downloadButton2" class="download-btn-secondary" style="display: none;"><i class="fas fa-server"></i><span data-translate="download_secondary">تحميل من رابط بديل</span></a>
                            <div class="security-info"><i class="fas fa-shield-alt"></i><span data-translate="secure_link">لینکەکە سەلامەتە و تاقیکراوەتەوە</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <!-- ============== Back to Top Button ============== -->
    <button id="backToTopBtn" title="Go to top" aria-label="Go to top"><i class="fas fa-arrow-up"></i></button>

    <!-- ============== Scripts ============== -->
    <!-- ============== Scripts ============== -->
<!-- === الإصلاح: تشغيل سكريبت الصفحة أولاً === -->
<script src="js/download.js?v=23092025"></script>
<script src="js/main-complete.js?v=1308"></script>
<script src="js/languages.js?v=1308"></script>
<script src="js/download-mobile.js?v=1309"></script>



    <!-- === Anti-Copy Script === -->


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
        
        <script>
  // ابدأ شريط التحميل عند بدء تحميل الصفحة
  NProgress.start();

  // عند اكتمال تحميل كل شيء (بما في ذلك الصور)، قم بإنهاء الشريط
  window.onload = function() {
    NProgress.done();
  };
</script>
        
     <?php include 'ads.php'; ?>
   <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>

        
        <!-- ========================================================== -->
<!-- ===      نافذة اكتشاف مانع الإعلانات (Anti-AdBlock)      === -->
<!-- ========================================================== -->
<div id="adblock-overlay">
    <div id="adblock-modal">
        <div class="adblock-icon">
            <i class="fas fa-shield-alt"></i>
        </div>
        <h2 data-translate="adblock_title"></h2>
        <p data-translate="adblock_message"></p>
        <button id="adblock-refresh-btn" data-translate="adblock_button"></button>
    </div>
</div>

<!-- ========================================================== -->
<!-- ===   النظام الجديد والمضمون لاكتشاف مانع الإعلانات    === -->
<!-- ========================================================== -->
<script src="https://cdn.jsdelivr.net/npm/blockadblock@3.2.1/blockadblock.min.js"></script>
<script>
// دالة لتشغيل نظام الحماية
function runAntiAdBlock() {
    // التحقق مما إذا كان مانع الإعلانات يعمل
    if (typeof blockAdBlock === 'undefined') {
        // إذا لم يتم تحميل السكريبت (بسبب مانع الإعلانات)، انتظر قليلاً ثم حاول مرة أخرى
        setTimeout(runAntiAdBlock, 200);
        return;
    }

    // إعدادات النظام
    blockAdBlock.setOption({
        checkOnLoad: true, // افحص عند تحميل الصفحة
        resetOnEnd: true,  // أعد الفحص إذا قام المستخدم بإيقاف المانع
        debug: false     // عطله عند الانتهاء من الاختبار
    });

    // ماذا يحدث عند اكتشاف مانع الإعلانات
    blockAdBlock.onDetected(function() {
        const overlay = document.getElementById('adblock-overlay');
        if(overlay) {
            overlay.style.display = 'flex';
            // منع تمرير الصفحة الخلفية
            document.body.style.overflow = 'hidden';
        }
    });
}

// تشغيل النظام
runAntiAdBlock();

// ربط وظيفة التحديث بالزر الموجود في النافذة
const refreshBtn = document.getElementById('adblock-refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        window.location.reload();
    });
}
</script>
        
</body>
</html>