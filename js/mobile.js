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
                const platformPrograms = allPrograms.filter(p => p.mainCategory === currentPlatform);
                
                const filtered = filter === 'all' ? platformPrograms : platformPrograms.filter(p => p.category === filter);
                displayCards(filtered);
            });
        });

        if(window.languageManager) window.languageManager.applyLanguage();
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