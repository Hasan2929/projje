// ====================================================================================
// ===       الكود النهائي والموحد لملف main-complete.js (V-FINAL & CLEANED)        ===
// ====================================================================================

// --- متغيرات عالمية ---
let globalProgramsCache = []; 
let isGlobalCacheLoaded = false;
let currentSlide = 0;
let slideInterval;

// --- نقطة البداية الرئيسية ---
document.addEventListener('DOMContentLoaded', initializeWebsite);

async function initializeWebsite() {
    // تشغيل كل وظائف الواجهة
    initializeSidebar();
    setupEventListeners();
    initializeHeaderTransparency();
    initializeBackToTopButton();
    initializeMobileFeatures(); // للتحكم بالشريط السفلي في الموبايل
     initializeMobileFilters();
    
    // جلب البيانات ثم تحميل محتوى الصفحة المحدد
    await fetchAllProgramsWithCache();
    loadPageSpecificContent();
    updateActiveNavLink();
    
    if(window.languageManager) {
    window.languageManager.applyLanguage();
}
}

async function fetchAllProgramsWithCache() {
    if (isGlobalCacheLoaded) return;
    try {
        const response = await fetch(`api/get_public_programs.php?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Failed to load programs. Server status: ${response.status}`);
        const programs = await response.json();
        if (Array.isArray(programs)) {
            globalProgramsCache = programs;
            isGlobalCacheLoaded = true;
        }
    } catch (error) {
        console.error("CRITICAL ERROR in fetchAllProgramsWithCache:", error);
        ['programsGrid', 'newProgramsGrid', 'topGamesGrid', 'topSoftwareGrid'].forEach(id => {
            const grid = document.getElementById(id);
            if(grid) grid.innerHTML = `<p style="grid-column: 1 / -1; color: red;">Failed to load content.</p>`;
        });
    }
}

function loadPageSpecificContent() {
    const pathName = window.location.pathname.replace(".php", "").replace(".html", "");
    const currentPage = pathName.split("/").pop() || "index";
    
    if (currentPage === 'index' || currentPage === '') {
        loadHomePageContent();
    } else {
        loadGenericPageContent(currentPage);
    }
}

// --- دوال تحميل المحتوى ---
function loadHomePageContent() {
        loadHeroSidePanel(); // <-- أضف هذا السطر
    loadNewPrograms();
    loadTopGames();
    loadTopSoftware();
    updateHeroStats();
    initializeSlider();
}

function loadGenericPageContent(pageName) {
    let programsToDisplay = [];
    
    if (pageName === 'games') {
        programsToDisplay = globalProgramsCache.filter(p => p.mainCategory === 'games');
    } else if (pageName === 'software') {
        programsToDisplay = globalProgramsCache.filter(p => p.mainCategory === 'software');
    } 
    // --- الجزء الجديد ---
    else if (pageName === 'android') {
        programsToDisplay = globalProgramsCache.filter(p => p.platform === 'android'); // أو حسب الحقل الذي تستخدمه
    } 
    else if (pageName === 'ios') {
        programsToDisplay = globalProgramsCache.filter(p => p.platform === 'ios'); // أو حسب الحقل الذي تستخدمه
    }
    
    const grid = document.getElementById('programsGrid');
    displayPrograms(programsToDisplay, grid);
    activatePageFilters(programsToDisplay); // هذه الدالة ستعمل مع الفلاتر الجديدة أيضاً
}

function loadNewPrograms() {
    const grid = document.getElementById('newProgramsGrid');
    if (!grid) return;
    const newItems = [...globalProgramsCache].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
    displayPrograms(newItems, grid);
}

function loadTopGames() {
    const grid = document.getElementById('topGamesGrid');
    if (!grid) return;
    const topGames = globalProgramsCache.filter(p => p.mainCategory === 'games').sort((a, b) => (parseInt(b.downloads, 10) || 0) - (parseInt(a.downloads, 10) || 0)).slice(0, 12);
    displayPrograms(topGames, grid);
}

function loadTopSoftware() {
    const grid = document.getElementById('topSoftwareGrid');
    if (!grid) return;
    const topSoftware = globalProgramsCache.filter(p => p.mainCategory === 'software').sort((a, b) => (parseInt(b.downloads, 10) || 0) - (parseInt(a.downloads, 10) || 0)).slice(0, 12);
    displayPrograms(topSoftware, grid);
}

function displayPrograms(programs, gridElement) {
    if (!gridElement) return;
    const message = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">لا توجد عناصر لعرضها في هذا القسم حالياً.</p>`;
    gridElement.innerHTML = (!programs || programs.length === 0) ? message : programs.map(createProgramCard).join('');
}

function createProgramCard(program) {
    const programName = program.name || "بەرنامە"; 
    return `
        <div class="card" onclick="goToDownloadPage('${program.id}')" title="${programName}">
            <div class="card2">
                <img class="card-image" src="${program.image || 'images/default-program.png'}" alt="${programName}" loading="lazy" onerror="this.onerror=null; this.src='images/default-program.png';">
            </div>
        </div>
    `;
}

function goToDownloadPage(id) {
    window.location.href = `download.php?id=${id}`;
}


// =========================================================================
// ===     الكود النهائي والمضمون 100% للقائمة الجانبية (V-FINAL PRO)     ===
// =========================================================================

function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileTabBar = document.querySelector('.mobile-tab-bar');

    if (!menuToggle || !sidebarMenu || !sidebarOverlay) return;

    const toggleSidebar = () => {
        const isOpen = document.body.classList.toggle('sidebar-open');
        if (mobileTabBar) {
            mobileTabBar.classList.toggle('hidden-by-sidebar', isOpen);
        }

        const navItems = sidebarMenu.querySelectorAll('.sidebar-nav .nav-item > a > span, .sidebar-nav .accordion-header > span');
        if (isOpen) {
            navItems.forEach((span, index) => {
                span.style.animation = `fadeInUp 0.5s ease-out ${index * 0.07}s forwards`;
            });
        } else {
            navItems.forEach(span => {
                span.style.animation = 'none';
                span.style.opacity = '0'; 
            });
        }
    };

    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    sidebarMenu.innerHTML = `
        <div class="sidebar-header">
            <div class="logo">
                <i class="fas fa-download"></i>
                <span class="site-name-text">KURD DOWN</span>
            </div>
            <button class="sidebar-close-btn"><i class="fas fa-times"></i></button>
        </div>
        <nav class="sidebar-nav">
            <div class="nav-item">
                <a href="index.php" data-translate="home"><i class="fas fa-home"></i><span data-translate="home"></span></a>
            </div>
            <div class="nav-item accordion">
                <div class="accordion-header">
                    <i class="fas fa-gamepad"></i><span data-translate="games_page_title"></span><i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div class="submenu">
                    <a href="games.php?filter=all" data-translate="filter_all"></a>
                    <a href="games.php?filter=PC" data-translate="filter_pc"></a>
                    <a href="games.php?filter=Playstation" data-translate="filter_playstation"></a>
                    <a href="games.php?filter=Xbox" data-translate="filter_xbox"></a>
                </div>
            </div>
            <div class="nav-item accordion">
                <div class="accordion-header">
                    <i class="fas fa-laptop-code"></i><span data-translate="software_page_title"></span><i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div class="submenu">
                    <a href="software.php?filter=all" data-translate="filter_all"></a>
                    <a href="software.php?filter=system" data-translate="filter_system"></a>
                    <a href="software.php?filter=montage" data-translate="filter_montage"></a>
                </div>
            </div>
            <div class="nav-item">
                <a href="ai-chat.php" data-translate="ai_page_title"><i class="fas fa-robot"></i><span></span></a>
            </div>
            <div class="nav-item">
                <a href="contact.php" data-translate="contact_us"><i class="fas fa-envelope"></i><span></span></a>
            </div>
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-lang">
                <button class="lang-btn" data-lang="ku">KU</button>
                <button class="lang-btn" data-lang="ar">AR</button>
                <button class="lang-btn" data-lang="en">EN</button>
            </div>
            <div class="theme-switch" id="theme-toggle-btn">
                 <i class="fas fa-sun"></i>
                <div class="theme-switch-toggle"></div>
                 <i class="fas fa-moon"></i>
            </div>
        </div>
    `;

    sidebarMenu.querySelector('.sidebar-close-btn')?.addEventListener('click', toggleSidebar);
    
    sidebarMenu.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            sidebarMenu.querySelectorAll('.accordion.open').forEach(openAccordion => {
                if (openAccordion !== header.parentElement) {
                    openAccordion.classList.remove('open');
                }
            });
            header.parentElement.classList.toggle('open');
        });
    });

    sidebarMenu.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const lang = e.currentTarget.dataset.lang;
            if(window.languageManager) {
                // ===> الإصلاح الحاسم هنا <===
                window.languageManager.currentLanguage = lang;
                window.languageManager.applyLanguage();
            }
        });
    });
    
    const themeToggleBtn = sidebarMenu.querySelector('#theme-toggle-btn');
    if (themeToggleBtn) {
        initializeThemeSwitcher(themeToggleBtn);
    }

    if(window.languageManager) {
        window.languageManager.applyLanguage();
    }
}

function initializeThemeSwitcher() {
    // نبحث عن الزر في كامل الصفحة
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) return; // إذا لم يتم العثور على الزر، توقف

    const body = document.body;

    const applyInitialTheme = () => {
        if (localStorage.getItem('theme') === 'light-mode') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    };

    const toggleTheme = () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode');
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    applyInitialTheme();
}


/**
 * الدالة النهائية والمكتملة لإعداد البحث الذكي والتمرير الصحيح للنتائج.
 */
/**
 * الدالة النهائية والمضمونة 100% باستخدام مكتبة body-scroll-lock
 */
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');

    if (searchInput && searchResultsDropdown) {
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();

            if (searchTerm.length < 2) {
                searchResultsDropdown.style.display = 'none';
                // التأكد من تمكين التمرير عند إخفاء القائمة
                bodyScrollLock.enableBodyScroll(searchResultsDropdown);
                return;
            }

            const searchKeywords = searchTerm.split(' ').filter(term => term.length > 0);
            const results = globalProgramsCache.filter(program => {
                const programNameLower = program.name.toLowerCase();
                return searchKeywords.every(keyword => programNameLower.includes(keyword));
            });
            
            displaySearchResults(results, searchResultsDropdown);

            // ===> الجزء الجديد والمهم <===
            // قفل تمرير الصفحة عندما تكون النتائج ظاهرة
            bodyScrollLock.disableBodyScroll(searchResultsDropdown);
        });

        // إخفاء قائمة النتائج عند النقر خارجها
        document.addEventListener('click', e => {
            if (!e.target.closest('#search-wrapper')) {
                if (searchResultsDropdown.style.display !== 'none') {
                    searchResultsDropdown.style.display = 'none';
                    // تمكين تمرير الصفحة مرة أخرى عند إخفاء القائمة
                    bodyScrollLock.enableBodyScroll(searchResultsDropdown);
                }
            }
        });
    }
}

function updateActiveLangButton() {
    const currentLang = localStorage.getItem('kurdin_language') || 'ku';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

function scrollHorizontal(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if(wrapper) wrapper.scrollBy({ left: wrapper.offsetWidth * 0.8 * direction, behavior: 'smooth' });
}

function updateHeroStats() {
    const heroStatsContainer = document.querySelector('.hero-stats');
    if (!heroStatsContainer) return;
    const gamesCount = globalProgramsCache.filter(p => p.mainCategory === 'games').length;
    const softwareCount = globalProgramsCache.filter(p => p.mainCategory === 'software').length;
    heroStatsContainer.innerHTML = `<div class="stat-item"><span class="stat-number">${softwareCount}</span><span class="stat-label" data-translate="software_stat"></span></div><div class="stat-item"><span class="stat-number">${gamesCount}</span><span class="stat-label" data-translate="game_stat"></span></div>`;
    if(window.languageManager) window.languageManager.applyLanguage();
}

function displaySearchResults(results, dropdownElement) {
    if (!dropdownElement) return;
    dropdownElement.innerHTML = results.length > 0 
        ? results.slice(0, 5).map(p => `<a href="download.php?id=${p.id}" class="search-result-item"><img src="${p.image || ''}" alt=""><span>${p.name}</span></a>`).join('')
        : `<div class="no-results">لا توجد نتائج.</div>`;
    dropdownElement.style.display = 'block';
}

function initializeHeaderTransparency() {
    const header = document.getElementById('main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
}

function initializeSlider() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderDots = document.getElementById('sliderDots');
    if (!sliderWrapper || !sliderDots) return;
    const slidesData = [
      { image: 'images/slider/console.png', link: 'games.php' },
      { image: 'images/slider/app.png', link: 'software.php' },
      { image: 'images/slider/ai.png', link: 'ai-chat.php' }
    ];
    sliderWrapper.innerHTML = slidesData.map((slide, index) => `<div class="slider-slide" style="background-image: url('${slide.image}')"><div class="slide-content"><h2 class="slide-title" data-translate="slide_${index + 1}_title"></h2><p class="slide-description" data-translate="slide_${index + 1}_desc"></p><a href="${slide.link}" class="slide-btn pulsating-glow" data-translate="slide_btn"></a>
</div></div>`).join('');
    sliderDots.innerHTML = slidesData.map((_, index) => `<div class="slider-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`).join('');
    if (window.languageManager) window.languageManager.applyLanguage();
    setupSliderEvents(slidesData.length);
    startAutoSlide(slidesData.length);
    const firstSlide = sliderWrapper.querySelector('.slider-slide');
    if (firstSlide) firstSlide.classList.add('active');
}

function setupSliderEvents(slideCount) {
    const updateAndRestart = (index) => { stopAutoSlide(); goToSlide(index, slideCount); startAutoSlide(slideCount); };
    document.getElementById('prevBtn')?.addEventListener('click', () => updateAndRestart(currentSlide - 1));
    document.getElementById('nextBtn')?.addEventListener('click', () => updateAndRestart(currentSlide + 1));
    document.querySelectorAll('.slider-dot').forEach(dot => {
        dot.addEventListener('click', () => updateAndRestart(parseInt(dot.dataset.slide)));
    });
}

function goToSlide(slideIndex, slideCount) {
    if (slideCount <= 1) return;
    currentSlide = (slideIndex + slideCount) % slideCount;
    document.querySelectorAll('.slider-slide').forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAutoSlide(slideCount) {
    if (slideCount <= 1) return;
    stopAutoSlide();
    slideInterval = setInterval(() => goToSlide(currentSlide + 1, slideCount), 4000);
}

function stopAutoSlide() { clearInterval(slideInterval); }

function initializeBackToTopButton() {
    const btn = document.getElementById("backToTopBtn");
    if (!btn) return;
    const scrollFn = () => btn.classList.toggle("show", window.scrollY > 150);
    window.addEventListener('scroll', scrollFn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function updateActiveNavLink() {
    const currentPageFile = window.location.pathname.split("/").pop() || 'index.php';
    document.querySelectorAll('.header .nav-link, .sidebar .nav-item > a').forEach(link => {
        const linkFile = (link.getAttribute('href') || '').split("/").pop();
        if(linkFile === currentPageFile){
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * الدالة النهائية والمطورة لتفعيل كل أنواع الفلاتر (الرئيسية والجانبية).
 */
function activatePageFilters(basePrograms) {
    const mainFilterButtons = document.querySelectorAll('.category-filters .filter-btn');
    const genreFilterButtons = document.querySelectorAll('.genre-filters-list .genre-filter-btn');
    const programsGrid = document.getElementById('programsGrid');
    
    if (!mainFilterButtons.length || !programsGrid) return;

    let currentMainFilter = 'all';
    let currentGenreFilter = 'all';

    // --- الجزء الجديد والمهم: اقرأ الفلاتر من الـ URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter'); 
    
    // تحقق إذا كان الفلتر القادم هو فلتر رئيسي أم ثانوي
    if (filterFromUrl) {
        let isMainFilter = false;
        mainFilterButtons.forEach(btn => {
            if (btn.dataset.filter === filterFromUrl) isMainFilter = true;
        });
        
        if(isMainFilter) {
            currentMainFilter = filterFromUrl;
        } else {
            currentGenreFilter = filterFromUrl;
        }
    }
    
    // دالة لتطبيق الفلترة وعرض النتائج
    const applyFilters = () => {
        let filtered = basePrograms;

        // 1. تطبيق الفلتر الرئيسي (PC, Playstation)
        if (currentMainFilter !== 'all') {
            filtered = filtered.filter(p => p.category === currentMainFilter);
        }

        // 2. تطبيق الفلتر الثانوي (النوع: Action, Sports)
        if (currentGenreFilter !== 'all') {
            filtered = filtered.filter(p => getGameGenre(p.name) === currentGenreFilter);
        }

        displayPrograms(filtered, programsGrid);
        updateActiveButtons();
    };

    // دالة لتحديث مظهر الأزرار النشطة
    const updateActiveButtons = () => {
        mainFilterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentMainFilter));
        if (genreFilterButtons.length) {
            genreFilterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.genreFilter === currentGenreFilter));
        }
    };

    // ربط وظيفة النقر بالأزرار الرئيسية
    mainFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentMainFilter = button.dataset.filter;
            applyFilters();
        });
    });

    // ربط وظيفة النقر بالأزرار الجانبية (إذا كانت موجودة)
    if (genreFilterButtons.length) {
        genreFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentGenreFilter = button.dataset.genreFilter;
                applyFilters();
            });
        });
    }

    // قم بتطبيق الفلاتر الأولية عند تحميل الصفحة
    applyFilters();
}

function initializeMobileFeatures() {
    if (window.innerWidth > 768) return;

    const tabBar = document.querySelector('.mobile-tab-bar');
    if (!tabBar) return;

    const currentPage = window.location.pathname.split('/').pop().replace('.php', '') || 'index';
    const pageToFind = (currentPage === '' || currentPage === 'index') ? 'index' : currentPage;
    
    const activeTab = tabBar.querySelector(`.tab-item[data-page="${pageToFind}"]`);
    if (activeTab) {
        tabBar.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
}

/**
 * دالة ذكية لتصنيف اللعبة تلقائياً بناءً على اسمها.
 * @param {string} gameName - اسم اللعبة.
 * @returns {string} - نوع اللعبة (Genre).
 */
function getGameGenre(gameName) {
    const name = gameName.toLowerCase();
    
    // قائمة الكلمات المفتاحية لكل نوع
    const genres = {
        'Sports': ['fifa', 'pes', 'nba', 'football', 'soccer', 'wwe', 'ufc'],
        'Racing': ['forza', 'need for speed', 'nfs', 'gran turismo', 'asphalt', 'grid', 'f1 '],
        'Action': ['call of duty', 'battlefield', 'gta', 'grand theft auto', 'uncharted', 'assassin\'s creed', 'far cry'],
        'Shooter': ['counter-strike', 'valorant', 'overwatch', 'doom', 'wolfenstein', 'destiny'],
        'Fighting': ['mortal kombat', 'street fighter', 'tekken', 'injustice', 'smash bros'],
        'RPG': ['witcher', 'fallout', 'elder scrolls', 'skyrim', 'cyberpunk', 'final fantasy'],
        'Adventure': ['spider-man', 'tomb raider', 'zelda', 'god of war', 'last of us'],
        'Horror': ['resident evil', 'silent hill', 'outlast', 'alien: isolation'],
        'Strategy': ['starcraft', 'warcraft', 'age of empires', 'civilization']
    };

    for (const genre in genres) {
        for (const keyword of genres[genre]) {
            if (name.includes(keyword)) {
                return genre;
            }
        }
    }
    
    return 'Action'; // نوع افتراضي إذا لم يتم العثور على تطابق
}



/**
 * دالة لتشغيل نظام الفلاتر الجديد للموبايل.
 */
/**
 * دالة لتشغيل نظام الفلاتر الجديد للموبايل مع تحديث نص الزر.
 */
/**
 * دالة لتشغيل نظام الفلاتر الجديد للموبايل مع تحديث نص الزر ودعم الترجمة.
 */
function initializeMobileFilters() {
    const triggerButton = document.getElementById('mobileFilterTrigger');
    const modalOverlay = document.getElementById('filterModalOverlay');
    const closeModalButton = document.getElementById('closeFilterModal');
    const desktopFilters = document.querySelector('.filters-sidebar .genre-filters-list');
    const modalBody = document.querySelector('.filter-modal-body');

    if (!triggerButton || !modalOverlay || !closeModalButton || !desktopFilters || !modalBody) return;

    modalBody.innerHTML = desktopFilters.innerHTML;

    const openModal = () => modalOverlay.classList.add('open');
    const closeModal = () => modalOverlay.classList.remove('open');

    triggerButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    const modalFilterButtons = modalBody.querySelectorAll('.genre-filter-btn');
    const desktopFilterButtons = desktopFilters.querySelectorAll('.genre-filter-btn');
    const triggerButtonTextSpan = triggerButton.querySelector('span');
    
    modalFilterButtons.forEach((modalButton, index) => {
        modalButton.addEventListener('click', () => {
            desktopFilterButtons[index].click(); 
            
            // === الجزء الجديد والمهم للترجمة ===
            if (triggerButtonTextSpan && window.languageManager) {
                const filterKey = modalButton.dataset.genreFilter;
                const translationKey = filterKey === 'all' ? 'filter_by_genre' : `genre_${filterKey.toLowerCase()}`;
                
                // استخدم مدير اللغات لجلب الترجمة الصحيحة
                const newText = window.languageManager.getTranslation(translationKey);
                
                triggerButtonTextSpan.textContent = newText;
                // أيضاً، قم بتحديث السمة لتتم ترجمتها لاحقاً عند تغيير اللغة
                triggerButtonTextSpan.setAttribute('data-translate', translationKey);
            }
            
            closeModal();
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

function loadHeroSidePanel() {
    const listContainer = document.getElementById('hero-new-programs');
    if (!listContainer || !isGlobalCacheLoaded) return;

    const newItems = [...globalProgramsCache]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10); // جلب أحدث 10 عناصر

    if (newItems.length === 0) {
        listContainer.innerHTML = `<p style="padding: 1rem; text-align: center;">لا توجد عناصر جديدة.</p>`;
        return;
    }
    
    listContainer.innerHTML = newItems.map(p => `
        <a href="download.php?id=${p.id}" class="side-program-item">
            <img src="${p.image || 'images/default-program.png'}" alt="${p.name}">
            <div class="side-program-info">
                <h4>${p.name}</h4>
                <span>${p.mainCategory === 'games' ? 'یاری' : 'بەرنامە'}</span>
            </div>
        </a>
    `).join('');
}


// ==========================================================
// ===         كود تشغيل تأثير الجسيمات العائمة         ===
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
    // نتأكد من أن المكتبة قد تم تحميلها والعنصر موجود
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 60, // عدد الجسيمات (يمكنك زيادته أو تقليله)
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff" // لون الجسيمات
                },
                "shape": {
                    "type": "circle",
                },
                "opacity": {
                    "value": 0.3, // شفافية الجسيمات
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3, // حجم الجسيمات
                    "random": true,
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.1, // شفافية الخطوط
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5, // سرعة الحركة
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab" // تأثير "الجذب" عند مرور الماوس
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push" // تأثير "الدفع" عند النقر
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_opacity": 0.3
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
});


const header = document.querySelector('.header');
if(header) {
    header.addEventListener('mousemove', e => {
        const rect = header.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        header.style.setProperty('--mouse-x', `${x}px`);
        header.style.setProperty('--mouse-y', `${y}px`);
    });
}

