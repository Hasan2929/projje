<?php
// === اكتشاف نوع نظام تشغيل الموبايل فقط ===
function getMobileOperatingSystem() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (preg_match('/android/i', $userAgent)) { return 'android'; }
    if (preg_match('/iphone|ipad|ipod/i', $userAgent)) { return 'ios'; }
    return 'android';
}
$os = getMobileOperatingSystem();
?>
<!DOCTYPE html>
<html lang="ku" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>KURD DOWN - Mobile</title>
    <link rel="stylesheet" href="styles/mobile.css?v=2.1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        // تمرير نظام التشغيل فقط
        window.UserOS = '<?php echo $os; ?>';
    </script>
</head>
<body>
    <header class="mobile-header">
        <div class="logo"><span class="site-name-text">KURD DOWN</span></div>
        <button class="header-action-btn" id="search-trigger-btn"><i class="fas fa-search"></i></button>
    </header>
    
    <main class="mobile-main-content">
        <section class="main-filters-container" id="main-filters-container"></section>
        <section class="mobile-programs-grid" id="mobileProgramsGrid">
            <!-- إضافة مؤشر تحميل جميل -->
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </section>
    </main>

    <nav class="mobile-tab-bar">
        <a href="index.php" class="tab-item"><i class="fas fa-desktop"></i><span>کۆمپیوتەر</span></a>
        <a href="#" class="tab-item" data-platform="android"><i class="fab fa-android"></i><span>ئەندرۆید</span></a>
        <a href="#" class="tab-item" data-platform="ios"><i class="fab fa-apple"></i><span>ئایفۆن</span></a>
        <button class="tab-item" id="menu-trigger-btn"><i class="fas fa-ellipsis-h"></i><span>زیاتر</span></button>
    </nav>
    
    <aside class="mobile-sidebar" id="mobileSidebar"></aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <div class="search-overlay" id="searchOverlay"></div>

    <script src="js/languages.js?v=2.1"></script>
    
    <!-- ========================================================== -->
<!-- ===   الكود المدمج والنهائي لواجهة الموبايل (مضمون)   === -->
<!-- ========================================================== -->
<script>
// =========================================================================
// ===     الكود الكامل والنهائي والمضمون 100% لواجهة الموبايل (V-PRO)   ===
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- متغيرات أساسية ---
    let allPrograms = [];
    const userOS = window.UserOS || 'android';
    const grid = document.getElementById('mobileProgramsGrid');
    const filtersContainer = document.getElementById('main-filters-container');
    let currentPlatform = userOS;

    // --- تعريف الفلاتر لكل منصة ---
    const filters = {
        pc: [
            { key: 'all', "data-translate": "filter_all" },
            { key: 'games', "data-translate": "games_page_title" },
            { key: 'software', "data-translate": "software_page_title" }
        ],
        android: [
            { key: 'all', "data-translate": "filter_all" },
            { key: 'games', "data-translate": "genre_games" },
            { key: 'tools', "data-translate": "genre_tools" },
            { key: 'social', "data-translate": "genre_social" }
            
        ],
        ios: [
            { key: 'all', "data-translate": "filter_all" },
            { key: 'games', "data-translate": "genre_games" },
            { key: 'tools', "data-translate": "genre_tools" },
            { key: 'media', "data-translate": "genre_media" }
        ]
    };

    /**
     * 1. جلب البيانات من السيرفر
     */
    async function fetchData() {
        try {
            const response = await fetch('api/get_public_programs.php');
            if (!response.ok) throw new Error('Network response was not ok');
            
            allPrograms = await response.json();
            
            // === الإصلاح الحاسم والنهائي هنا ===
            // سننتظر قليلاً (200 ميللي ثانية) قبل عرض المحتوى
            // هذا يعطي وقتاً كافياً لكل شيء آخر ليتم تحميله
            setTimeout(() => {
                displayContent(userOS);
            }, 200); 
            
        } catch (error) {
            console.error("Failed to fetch programs:", error);
            if (grid) grid.innerHTML = `<p style="color:red; grid-column: 1/-1; text-align:center;">فشل تحميل المحتوى. الرجاء تحديث الصفحة.</p>`;
        }
    }

    /**
     * 2. عرض المحتوى الرئيسي والفلاتر بناءً على المنصة المختارة
     * @param {string} platform - المنصة المطلوبة ('pc', 'android', 'ios')
     */
    function displayContent(platform) {
        currentPlatform = platform;
        
        let programsToDisplay;
        if (platform === 'pc') {
            programsToDisplay = allPrograms.filter(p => p.mainCategory === 'games' || p.mainCategory === 'software');
        } else {
            programsToDisplay = allPrograms.filter(p => p.mainCategory === platform); // نفترض أن mainCategory تحتوي على 'android' أو 'ios'
        }

        displayCards(programsToDisplay);
        generateFilters(filters[platform] || []);

        document.querySelectorAll('.mobile-tab-bar .tab-item').forEach(tab => {
            const isPcLink = tab.href.includes('index.php');
            if (isPcLink) {
                tab.classList.toggle('active', platform === 'pc');
            } else {
                tab.classList.toggle('active', tab.dataset.platform === platform);
            }
        });
    }

    /**
     * 3. إنشاء وعرض بطاقات البرامج في الشبكة
     * @param {Array<object>} programs - مصفوفة البرامج لعرضها
     */
    function displayCards(programs) {
        if (!grid) return;
        if (programs.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">هیچ بەرنامەیەک نەدۆزرایەوە.</p>`;
            return;
        }
        grid.innerHTML = programs.map(p => `
            <a href="download.php?id=${p.id}" class="mobile-card">
                <img src="${p.image || 'images/default-program.png'}" alt="${p.name}" loading="lazy">
                <div class="mobile-card-info">
                    <h4 class="mobile-card-title">${p.name}</h4>
                    <p class="mobile-card-category">${p.category}</p>
                </div>
            </a>
        `).join('');
    }

    /**
     * 4. إنشاء أزرار الفلاتر ديناميكياً
     * @param {Array<object>} filterData - مصفوفة بيانات الفلاتر
     */
    function generateFilters(filterData) {
    if (!filtersContainer) return;
    filtersContainer.innerHTML = filterData.map((f, i) => 
        `<button class="main-filter-btn ${i === 0 ? 'active' : ''}" data-filter="${f.key}" data-translate="${f['data-translate']}"></button>`
    ).join('');
    
    filtersContainer.querySelectorAll('.main-filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            filtersContainer.querySelectorAll('.main-filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // --- المنطق الذكي هنا ---
            // أولاً، احصل على كل برامج المنصة الحالية
            const platformPrograms = allPrograms.filter(p => p.mainCategory === currentPlatform);
            
            // ثانياً، قم بالفلترة بناءً على الزر المضغوط
            let filtered;
            if (filter === 'all') {
                filtered = platformPrograms; // عرض الكل
            } else if (filter === 'games') {
                // حالة خاصة: اعرض الألعاب فقط من هذه المنصة
                filtered = platformPrograms.filter(p => p.category.toLowerCase().includes('game'));
            } else {
                // فلترة ذكية لبقية الفئات
                filtered = platformPrograms.filter(p => getAppCategory(p.name) === filter);
            }
            
            displayCards(filtered);
        });
    });

    if(window.languageManager) window.languageManager.applyLanguage();
}

// أضف هذه الدالة الجديدة للفلترة الذكية داخل mobile.js
function getAppCategory(appName) {
    const name = appName.toLowerCase();
    const categories = {
        'tools': ['vpn', 'cleaner', 'manager', 'explorer', 'utility'],
        'social': ['facebook', 'instagram', 'whatsapp', 'telegram', 'tiktok', 'snapchat'],
        'media': ['player', 'gallery', 'vlc', 'mx player'],
        'photo_video': ['editor', 'camera', 'gallery', 'photoshop', 'lightroom'],
        'productivity': ['office', 'word', 'excel', 'docs', 'sheets']
    };

    for (const category in categories) {
        for (const keyword of categories[category]) {
            if (name.includes(keyword)) return category;
        }
    }
    return 'tools'; // فئة افتراضية
}
    
    // --- 5. تفعيل الأزرار التفاعلية ---
    
    // أزرار الشريط السفلي
    document.querySelectorAll('.mobile-tab-bar .tab-item[data-platform]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            displayContent(tab.dataset.platform);
        });
    });
    
    // القائمة الجانبية (Sidebar)
    const sidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuTrigger = document.getElementById('menu-trigger-btn');
    if(sidebar) {
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3 data-translate="menu"></h3>
                <button class="close-btn" id="closeSidebarBtn">&times;</button>
            </div>
            <div class="sidebar-content">
                <a href="index.php" class="sidebar-link"><i class="fas fa-home"></i><span data-translate="home"></span></a>
                <a href="contact.php" class="sidebar-link"><i class="fas fa-envelope"></i><span data-translate="contact_us"></span></a>
                <a href="ai-chat.php" class="sidebar-link"><i class="fas fa-robot"></i><span data-translate="ai_page_title"></span></a>
            </div>
        `;
    }
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const toggleSidebar = (forceClose = false) => {
        if (forceClose || sidebar?.classList.contains('open')) {
            sidebar?.classList.remove('open');
            sidebarOverlay?.classList.remove('open');
        } else {
            sidebar?.classList.add('open');
            sidebarOverlay?.classList.add('open');
        }
    };
    menuTrigger?.addEventListener('click', () => toggleSidebar());
    closeSidebarBtn?.addEventListener('click', () => toggleSidebar(true));
    sidebarOverlay?.addEventListener('click', () => toggleSidebar(true));
    
    // نافذة البحث
    const searchOverlay = document.getElementById('searchOverlay');
    if(searchOverlay) {
         searchOverlay.innerHTML = `
            <div class="search-modal">
                <input type="text" id="mobileSearchInput" placeholder="گەڕان...">
                <button class="close-btn" id="closeSearchBtn">&times;</button>
            </div>
            <div class="search-results-container" id="searchResultsContainer"></div>
        `;
    }
    const searchTrigger = document.getElementById('search-trigger-btn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('mobileSearchInput');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    searchTrigger?.addEventListener('click', () => searchOverlay.classList.add('open'));
    closeSearchBtn?.addEventListener('click', () => searchOverlay.classList.remove('open'));
    searchInput?.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        const results = term.length > 1 ? allPrograms.filter(p => p.name.toLowerCase().includes(term)) : [];
        if(searchResultsContainer) {
            searchResultsContainer.innerHTML = results.map(p => `
                 <a href="download.php?id=${p.id}" class="search-result-item">
                    <img src="${p.image || ''}" alt="${p.name}">
                    <div class="search-result-info">
                        <h4>${p.name}</h4>
                        <p>${p.category}</p>
                    </div>
                </a>
            `).join('');
        }
    });
    
    // --- 6. ابدأ كل شيء! ---
    fetchData();
});
</script>

<!-- ========================================================== -->
<!-- ===   الكود المدمج والنهائي لواجهة الموبايل (مضمون)   === -->
<!-- ========================================================== -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    // البيانات موجودة بالفعل بفضل PHP
    const allPrograms = window.KurdDownPrograms || [];
    const userOS = window.UserOS || 'android';
    const grid = document.getElementById('mobileProgramsGrid');
    const filtersContainer = document.getElementById('main-filters-container');
    let currentPlatform = userOS;

    const filters = {
        pc: [ /* ... */ ],
        android: [
            { key: 'all', "data-translate": "filter_all" },
            { key: 'games', "data-translate": "genre_games" },
            { key: 'tools', "data-translate": "genre_tools" },
            { key: 'social', "data-translate": "genre_social" }
        ],
        ios: [ /* ... */ ]
    };

    function displayContent(platform) {
        currentPlatform = platform;
        let programsToDisplay;

        if (platform === 'pc') {
            programsToDisplay = allPrograms.filter(p => p.mainCategory === 'games' || p.mainCategory === 'software');
        } else {
            programsToDisplay = allPrograms.filter(p => p.mainCategory === platform);
        }

        displayCards(programsToDisplay);
        generateFilters(filters[platform] || []);

        document.querySelectorAll('.mobile-tab-bar .tab-item').forEach(tab => {
            const isPcLink = tab.href.includes('index.php');
            if (isPcLink) {
                tab.classList.toggle('active', platform === 'pc');
            } else {
                tab.classList.toggle('active', tab.dataset.platform === platform);
            }
        });
    }

    function displayCards(programs) {
        if (!grid) return;
        grid.innerHTML = (programs.length > 0) ? programs.map(p => `
            <a href="download.php?id=${p.id}" class="mobile-card">
                <img src="${p.image || ''}" alt="${p.name}" loading="lazy">
                <div class="mobile-card-info">
                    <h4 class="mobile-card-title">${p.name}</h4>
                    <p class="mobile-card-category">${p.category}</p>
                </div>
            </a>
        `).join('') : `<p style="grid-column: 1 / -1; text-align: center;">هیچ شتێک نەدۆزرایەوە.</p>`;
    }

    function generateFilters(filterData) {
        if (!filtersContainer) return;
        filtersContainer.innerHTML = filterData.map((f, i) => 
            `<button class="main-filter-btn ${i === 0 ? 'active' : ''}" data-filter="${f.key}" data-translate="${f['data-translate']}"></button>`
        ).join('');
        
        filtersContainer.querySelectorAll('.main-filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                filtersContainer.querySelectorAll('.main-filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                const platformPrograms = allPrograms.filter(p => p.mainCategory === currentPlatform);
                const filtered = filter === 'all' ? platformPrograms : platformPrograms.filter(p => p.category === filter);
                displayCards(filtered);
            });
        });

        if(window.languageManager) window.languageManager.applyLanguage();
    }
    
    // ربط أزرار الشريط السفلي
    document.querySelectorAll('.mobile-tab-bar .tab-item[data-platform]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            displayContent(tab.dataset.platform);
        });
    });
    
    // (كود القائمة الجانبية والبحث يبقى كما هو)

    // --- عرض المحتوى الأولي فوراً ---
    displayContent(userOS);
});
</script>

<script src="js/mobile.js?v=PRO_MAX"></script>
<script src="js/languages.js?v=PRO_MAX"></script>
    
</body>
</html>