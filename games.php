<!DOCTYPE html>
<html lang="ku" dir="rtl">
<head>
    <!-- ============== Meta Tags & Title ============== -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>یارییەکان - KURD DOWN</title> <!-- Changed Title to Kurdish -->
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2399127081177956"
     crossorigin="anonymous"></script>

    <!-- ============== Favicon (Updated Path) ============== -->
    <link rel="icon" type="image/png" href="images/favicon.png">
    <!-- NProgress Loading Bar CSS & JS -->
<link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css"/>
<script src="https://unpkg.com/nprogress@0.2.0/nprogress.js"></script>

    <!-- ============== Stylesheets ============== -->
    <link rel="stylesheet" href="styles/main.css?v=<?php echo time(); ?>">
        <link rel="stylesheet" href="styles/games-page.css?v=<?php echo time(); ?>">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- ============== Google Services ============== -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2399127081177956"
     crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-54VGJRYN42"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-54VGJRYN42');
    </script>
</head>

<body data-page-title="games_page_title">
        <div id="particles-js"></div>

    <div id="page-transition-overlay"></div>

    <!-- ============== Sidebar (Menu) ============== -->
    <aside class="sidebar" id="sidebarMenu"></aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- ============== Header (Standardized) ============== -->
    <header class="header" id="main-header">
    <div class="container">
        <div class="header-content">
            
            <!-- === Right Section (Menu Button & Nav Links) === -->
            <div class="header-right">
                <button class="menu-toggle" id="menuToggle">
                    <span></span><span></span><span></span>
                </button>
                <nav class="nav" id="nav">
                   <ul class="nav-list">
    <li><a href="index.php" class="nav-link" data-translate="home"></a></li>
    <li><a href="games.php" class="nav-link" data-translate="games_page_title"></a></li>
    <li><a href="software.php" class="nav-link" data-translate="software_page_title"></a></li>
    
    <!-- ▼▼▼ الروابط الجديدة ▼▼▼ -->
    <li><a href="android.php" class="nav-link" data-translate="android_page_title"></a></li>
    <li><a href="ios.php" class="nav-link" data-translate="ios_page_title"></a></li>
    <!-- ▲▲▲ نهاية الروابط الجديدة ▲▲▲ -->

    <li><a href="ai-chat.php" class="nav-link" data-translate="ai_page_title"></a></li>
</ul>
                </nav>
            </div>
    
            <!-- === Center Section (Logos for both states) === -->
            <div class="header-center">
                <!-- 1. الشعار الكبير (يظهر في الأعلى فقط) -->
               
                <!-- 2. الشعار الصغير (يظهر عند التمرير فقط) -->
                <div class="small-logo">
                    <a href="index.php" class="logo">
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            </div>
    
            <!-- === Left Section (Search) === -->
            <div class="header-left">
                <div id="search-wrapper">
                    <div id="searchResultsDropdown"></div> <!-- تم نقلها هنا -->
                    <div class="glow"></div><div class="darkBorderBg"></div><div class="darkBorderBg"></div><div class="darkBorderBg"></div><div class="white"></div>
                    <input placeholder="گەڕان بۆ بەرنامەکان..." type="text" name="text" class="input" id="searchInput" data-translate="search_placeholder"/>
                    <div id="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" height="24" fill="none" class="feather feather-search"><circle stroke="url(#search)" r="8" cy="11" cx="11"></circle><line stroke="url(#searchl)" y2="16.65" y1="22" x2="16.65" x1="22"></line><defs><linearGradient gradientTransform="rotate(50)" id="search"><stop stop-color="#f8e7f8" offset="0%"></stop><stop stop-color="#b6a9b7" offset="50%"></stop></linearGradient><linearGradient id="searchl"><stop stop-color="#b6a9b7" offset="0%"></stop><stop stop-color="#837484" offset="50%"></stop></linearGradient></defs></svg></div>
                </div>
            </div>

        </div>
    </div>
</header>

   <!-- ========================================================== -->
<!-- ===       الهيكل النهائي لصفحة الألعاب (مضمون)       === -->
<!-- ========================================================== -->
<div class="page-wrapper container">
        
    <!-- ======================================================= -->
    <!-- ===   1. القائمة الجانبية للفلاتر (للكومبيوتر)     === -->
    <!-- ======================================================= -->
    <aside class="filters-sidebar">
        <h3 class="filters-title" data-translate="genres_title"></h3>
        <ul class="genre-filters-list">
            <li><button class="genre-filter-btn active" data-genre-filter="all" data-translate="filter_all_genres"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Action" data-translate="genre_action"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Adventure" data-translate="genre_adventure"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="RPG" data-translate="genre_rpg"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Strategy" data-translate="genre_strategy"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Sports" data-translate="genre_sports"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Racing" data-translate="genre_racing"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Fighting" data-translate="genre_fighting"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Horror" data-translate="genre_horror"></button></li>
            <li><button class="genre-filter-btn" data-genre-filter="Shooter" data-translate="genre_shooter"></button></li>
        </ul>
    </aside>

    <!-- ======================================================= -->
    <!-- ===      2. قسم المحتوى الرئيسي للألعاب            === -->
    <!-- ======================================================= -->
    <main class="main-content-grid">
        
        <!-- --- هيدر المحتوى (يحتوي على العنوان وزر الموبايل) --- -->
        <div class="main-content-header">
            <h1 class="section-title" data-translate="games_page_title"></h1>
            <button class="mobile-filter-trigger" id="mobileFilterTrigger">
                <i class="fas fa-filter"></i>
                <span data-translate="filter_by_genre"></span>
            </button>
        </div>
        
        <!-- --- الفلاتر الرئيسية (PC, Playstation, etc.) --- -->
        <div class="category-filters">
            <button class="filter-btn active" data-filter="all" data-translate="filter_all"></button>
            <button class="filter-btn" data-filter="PC" data-translate="filter_pc"></button>
            <button class="filter-btn" data-filter="Playstation" data-translate="filter_playstation"></button>
            <button class="filter-btn" data-filter="Xbox" data-translate="filter_xbox"></button>
        </div>
        
        <!-- --- شبكة عرض الألعاب --- -->
        <div class="programs-grid" id="programsGrid">
            <!-- سيتم عرض الألعاب هنا بواسطة JavaScript -->
        </div>

    </main>
</div>

    <!-- ============== Footer (Standardized) ============== -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo"><i class="fas fa-download"></i><span>KURD DOWN</span></div>
                    <p data-translate="trusted_platform">پلاتفۆرمی متمانەپێکراوت بۆ داگرتنی باشترین بەرنامە و ئەپەکان</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/hasan.harki.34223" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/kurd_down/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://t.me/+zaxkla7Iz3A5NDZi" target="_blank" aria-label="Telegram"><i class="fab fa-telegram-plane"></i></a>
                        <a href="https://t.snapchat.com/rinL3s3p" target="_blank" aria-label="Snapchat"><i class="fab fa-snapchat"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4 data-translate="sections">بەشەکان</h4>
                    <ul>
                        <li><a href="games.php" data-translate="games_page_title">ألعاب</a></li>
                        <li><a href="software.php" data-translate="software_page_title">برامج عامة</a></li>
                        <li><a href="ai-chat.php" data-translate="ai_page_title">KURD AI</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 data-translate="useful_links">بەستەرە بەسوودەکان</h4>
                    <ul>
                        <li><a href="contact.php" data-translate="contact_us">پەیوەندیمان پێوە بکە</a></li>
                        <li><a href="privacy.policy.php" data-translate="privacy_policy">سیاسەتی تایبەتمەندی</a></li>
                        <li><a href="terms of use.php" data-translate="terms_of_use">مەرجەکانی بەکارهێنان</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 data-translate="contact_us">پەیوەندیمان پێوە بکە</h4>
                    <div class="contact-info">
                        <p><i class="fas fa-envelope"></i> info@kurddown.store</p>
                        <p><i class="fas fa-phone"></i> 07511261590</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; KURD-DOWN. <span data-translate="all_rights_reserved">هەموو مافەکان پارێزراون.</span></p>
                <p class="powered-by">POWERED BY <a href="https://www.instagram.com/hasan.a.harki" target="_blank" class="hasan-link">HASAN</a></p>
            </div>
        </div>
    </footer>
    
    <!-- ============== Back to Top Button ============== -->
    <button id="backToTopBtn" title="Go to top" aria-label="Go to top"><i class="fas fa-arrow-up"></i></button>  
    <script src="https://cdn.jsdelivr.net/npm/body-scroll-lock@3.1.5/lib/bodyScrollLock.min.js"></script>


    <!-- ============== Scripts ============== -->
    <!-- **الإصلاح الحاسم لمشكلة الكاش** -->
<script src="js/main-complete.js?v=<?php echo time(); ?>"></script>
<script src="js/languages.js?v=<?php echo time(); ?>"></script>
    <script>
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
            }
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
    
    
    <!-- ========================================================== -->
<!-- ===   النافذة المنبثقة الجديدة لفلاتر الموبايل   === -->
<!-- ========================================================== -->
<div class="filter-modal-overlay" id="filterModalOverlay">
    <div class="filter-modal-content">
        <div class="filter-modal-header">
            <h3>فلتەرکردن بەپێی جۆر</h3>
            <button class="close-filter-modal" id="closeFilterModal">&times;</button>
        </div>
        <div class="filter-modal-body">
            <!-- سيتم نسخ الفلاتر إلى هنا بواسطة JavaScript -->
        </div>
    </div>
</div>

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
    
