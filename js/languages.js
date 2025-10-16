// =====================================================================
// === الكود الكامل والنهائي لملف js/languages.js (مع كل الإصلاحات) ===
// =====================================================================

const translations = {
   ku: {
    home: "سەرەکی",
    games_page_title: "یارییەکان",
    software_page_title: "بەرنامە گشتییەکان",
    ai_page_title: "KURD AI",
    contact: "پەیوەندی", 
    search_placeholder: "گەڕان بۆ بەرنامەکان...",
    all: "هەموو", 
    hero_title_1: "باشترین بەرنامەکان بدۆزەرەوە", 
    hero_title_2: "بۆ کۆمپیوتەرەکەت",
    hero_description: "پلاتفۆرمێکی تەواو بۆ داگرتنی نوێترین و باشترین بەرنامە و ئەپەکان بۆ کۆمپیوتەر",
    programs: "بەرنامە", 
    games_section: "یارییەکان", 
    featured_programs: "بەرنامە تایبەتەکان", 
    trusted_platform: "پلاتفۆرمی متمانەپێکراوت",
    sections: "بەشەکان", 
    useful_links: "بەستەرە بەسوودەکان", 
    contact_us: "پەیوەندیمان پێوە بکە", 
    all_rights_reserved: "هەموو مافەکان پارێزراون.",
    privacy_policy: "سیاسەتی تایبەتمەندی", 
    terms_of_use: "مەرجەکانی بەکارهێنان", 
    contact_page_title: "پەیوەندیمان پێوە بکە",
    contact_desc: "ئەگەر پرسیار یان پێشنیارت هەیە، پەیوەندیمان پێوە بگرە", 
    your_name: "ناو", 
    your_email: "ئیمەیڵ",
    subject: "بابەت", 
    your_message: "پەیام", 
    send_message: "ناردنی پەیام",
     contact_info: "زانیاری پەیوەندی",
    contact_info_desc: "تۆ دەتوانیت ئێمە بدۆزیتەوە لە ڕێگەی زانیارییەکانی خوارەوە.",
    email: "ئیمەیڵ",
    phone: "ژمارەی تەلەفۆن",
    send_us_message: "نامەیەکمان بۆ بنێرە",
    form_desc: "ئێمە لە نزیکترین کاتدا وەڵامت دەدەینەوە.",
     whats_new: "نوێترینەکان لە KURD DOWN",
     top_games: "باشترین یارییەکان",
     top_software: "باشترین بەرنامەکان",
     game_stat: "یاری",
    software_stat: "بەرنامە",
    rate_this_item: "ئەم ئایتمە هەڵسەنگێنە:",
    comments_section_title: "سەرنجەکان",
    comment_placeholder: "...سەرنجەکەت لێرە بنووسە",
    name_placeholder: "ناوەکەت (ئارەزوومەندانە)",
    post_comment_btn: "سەرنجەکەت بنێرە",
    rating_feedback_part1: "سوپاس! تۆ ",
    rating_feedback_part2: " ئەستێرەت دا.",
    no_comments_yet: "هێشتا هیچ سەرنجێک نییە. یەکەم کەس بە!",
    filter_all: "هەموو",
    filter_pc: "کۆمپیوتەر",
    filter_playstation: "پلەیستەیشن",
    filter_xbox: "ئێکس بۆکس",
    filter_montage: "مۆنتاژ",
    filter_system: "سیستەم",
    filter_mobile: "مۆبایل",
    filter_office: "مەیکرۆسۆفت ئۆفیس",
    filter_programming: "بەرنامەسازی",
filter_drivers: "پێناسەکان",
filter_antivirus: "دژە ڤایرۆس",
filter_extensions: "زیادکراوەکانی وێبگەڕ",
    "genres_title": "جۆری یارییەکان",
        "filter_all_genres": "هەموو جۆرەکان",
        "genre_action": "ئەکشن",
        "genre_adventure": "سەرکێشی",
        "genre_rpg": "RPG",
        "genre_strategy": "ستراتیجی",
        "genre_sports": "وەرزشی",
        "genre_racing": "پێشبڕکێ",
        "genre_fighting": "شەڕکردن",
        "genre_horror": "ترسناک",
        "genre_shooter": "شووتەر",
        "filter_by_genre": "فلتەرکردن بەپێی جۆر",
"hero_whats_new": "تازه زیادکراوەکان",
        "hero_see_more": "زیاتر ببینە",
        
        // === الترجمات الجديدة لأزرار الفئات ===
        "cat_all_software": "هەموو بەرنامەکان",
        "cat_racing": "پێشبڕکێ",
        "cat_sports": "یاری وەرزشی",
        "cat_action": "یاری ئەکشن",
        "cat_montage": "مۆنتاژ",
        "cat_system": "بەرنامەی سیستەم",
         "adblock_title": "تکایە ڕیکلام-بلۆکەرەکەت بکوژێنەرەوە",
        "adblock_message": "ئێمە پشت بە ڕیکلام دەبەستین بۆ بەردەوامبوونی خزمەتگوزارییەکانمان. تکایە ماڵپەڕەکەمان بخەرە لیستی سپی (Whitelist) و دواتر پەڕەکە نوێ بکەرەوە.",
        "adblock_button": "نوێکردنەوەی پەڕە",
         "android_page_title": "بەرنامەکانی ئەندرۆید",
        "ios_page_title": "بەرنامەکانی ئایفۆن",
        "categories": "پۆلەکان",
        
        // === ترجمات الفلاتر الجديدة ===
        "genre_tools": "ئامرازەکان",
        "genre_social": "تۆڕە کۆمەڵایەتییەکان",
        "genre_media": "میدیا",
        "genre_games": "یارییەکان (مۆبایل)",
        
slide_1_title: "یارییەکانی کۆنسۆڵ",
    slide_1_desc: "هەموو یارییەکانی پلەیستەیشن و ئێکس بۆکس بدۆزەرەوە",
    slide_2_title: "بەرنامە پیشەگەرەکان",
    slide_2_desc: "هەموو ئەو بەرنامانەی کە پێویستتە بۆ بەرهەمهێنان و دیزاین",
    slide_3_title: "بەهێزترین زیرەیەکی دەستکرد",
    slide_3_desc: "بەهێزترین زیرەیەکی دەستکرد نوى AI",
    slide_btn: "ئێستا بیدۆزەرەوە",
    
    // نصوص صفحة التحميل
    download_page_title: "داگرتنی بەرنامە", about_program: "دەربارەی بەرنامە", version: "وەشان",
    size: "قەبارە", total_downloads: "کۆی داگرتنەکان", category: "پۆل",
    direct_download: "لینکی داگرتنی ڕاستەوخۆ", click_to_download: "بۆ دەستپێکردنی داگرتن کرتە لە دوگمەی خوارەوە بکە.",
    download_now: "داگرتن", download_done: "داگیرا!", no_link: "لینک نییە", secure_link: "لینکەکە سەلامەتە"
},
    ar: {
    home: "الرئيسية", games_page_title: "ألعاب", software_page_title: "برامج عامة",
    ai_page_title: "KURD AI", contact: "تواصل معنا", search_placeholder: "ابحث...",
    all: "الكل", hero_title_1: "اكتشف أفضل البرامج", hero_title_2: "لجهاز الكمبيوتر الخاص بك",
    hero_description: "منصة شاملة لتحميل أحدث البرامج لجهاز الكمبيوتر الخاص بك.",
    programs: "برامج", games_section: "ألعاب", featured_programs: "أحدث البرامج", trusted_platform: "منصتك الموثوقة",
    sections: "الأقسام", useful_links: "روابط مفيدة", contact_us: "تواصل معنا", all_rights_reserved: "كل الحقوق محفوظة.",
    privacy_policy: "سياسة الخصوصية", terms_of_use: "شروط الاستخدام", contact_page_title: "تواصل معنا",
    contact_desc: "إذا كان لديك أي أسئلة أو اقتراحات ، فلا تتردد في الاتصال بنا.", your_name: "الاسم",
    your_email: "البريد الإلكتروني", subject: "الموضوع", your_message: "الرسالة", send_message: "إرسال",
    whats_new: "الجديد في KURD DOWN",
    top_games: "توب الألعاب",
    top_software: "توب البرامج",
     game_stat: "لعبة",
    software_stat: "برنامج",
    rate_this_item: "قيم هذا العنصر:",
    comments_section_title: "التعليقات",
    comment_placeholder: "...اكتب تعليقك هنا",
    name_placeholder: "اسمك (اختياري)",
    post_comment_btn: "نشر التعليق",
    rating_feedback_part1: "شكراً لك! لقد قمت بتقييم ",
    rating_feedback_part2: " نجوم.",
    no_comments_yet: "لا توجد تعليقات بعد. كن أول من يعلق!",
    filter_all: "الكل",
    filter_pc: "كمبيوتر",
    filter_playstation: "بلايستيشن",
    filter_xbox: "إكس بوكس",
    filter_montage: "مونتاج",
    filter_system: "النظام",
    filter_mobile: "موبايل",
    filter_office: "اوفيس",
    filter_programming: "برمجة",
filter_drivers: "التعريفات",
filter_antivirus: "مكافحة الفيروسات",
filter_extensions: "ملحقات المتصفح",

"genres_title": "أنواع الألعاب",
        "filter_all_genres": "كل الأنواع",
        "genre_action": "أكشن",
        "genre_adventure": "مغامرات",
        "genre_rpg": "آر بي جي",
        "genre_strategy": "استراتيجية",
        "genre_sports": "رياضة",
        "genre_racing": "سباقات",
        "genre_fighting": "قتال",
        "genre_horror": "رعب",
        "genre_shooter": "تصويب",
        "filter_by_genre": "فلترة حسب النوع",
        "hero_whats_new": "أحدث الإضافات",
        "hero_see_more": "شاهد المزيد",

        // === الترجمات الجديدة لأزرار الفئات ===
        "cat_all_software": "كل البرامج",
        "cat_racing": "سباقات",
        "cat_sports": "رياضة",
        "cat_action": "أكشن",
        "cat_montage": "مونتاج",
        "cat_system": "برامج النظام"
    ,
"adblock_title": "الرجاء إيقاف مانع الإعلانات",
        "adblock_message": "نحن نعتمد على الإعلانات لتقديم خدماتنا مجاناً. لطفاً، قم بإضافة موقعنا إلى القائمة البيضاء ثم اضغط على زر التحديث.",
        "adblock_button": "تحديث الصفحة",
         "android_page_title": "تطبيقات أندرويد",
        "ios_page_title": "تطبيقات آيفون",
        "categories": "الفئات",
        "genre_tools": "أدوات",
        "genre_social": "تواصل اجتماعي",
        "genre_media": "وسائط",
        "genre_games": "ألعاب (موبايل)",
slide_1_title: "ألعاب الكونسول",
    slide_1_desc: "اكتشف أحدث الألعاب لمنصات بلايستيشن وإكس بوكس",
    slide_2_title: "برامج احترافية",
    slide_2_desc: "كل ما تحتاجه من برامج الإنتاجية والتصميم للكمبيوتر",
    slide_3_title: "أقوى ألعاب الكمبيوتر",
    slide_3_desc: "انطلق في مغامرات جديدة مع أضخم مكتبة ألعاب للـ PC",
    slide_btn: "استكشف الآن",



    // نصوص صفحة التحميل
    download_page_title: "تحميل البرنامج", about_program: "عن البرنامج", version: "الإصدار",
    size: "الحجم", total_downloads: "إجمالي التحميلات", category: "الفئة",
    direct_download: "رابط التحميل المباشر", click_to_download: "اضغط على الزر أدناه لبدء التحميل.",
    download_now: "تحميل", download_done: "تم!", no_link: "لا يوجد رابط", secure_link: "الرابط آمن"
},
    en: {
    home: "Home", games_page_title: "Games", software_page_title: "General Software",
    ai_page_title: "KURD AI", contact: "Contact", search_placeholder: "Search for programs...",
    all: "All", hero_title_1: "Discover The Best", hero_title_2: "Software For Your PC",
    hero_description: "A comprehensive platform to download the latest and best software for your computer.",
    programs: "Programs", games_section: "Games", featured_programs: "Featured Programs", trusted_platform: "Your trusted platform",
    sections: "Sections", useful_links: "Useful Links", contact_us: "Contact Us", all_rights_reserved: "All rights reserved.",
    privacy_policy: "Privacy Policy", terms_of_use: "Terms of Use", contact_page_title: "Contact Us",
    contact_desc: "If you have any questions or suggestions, feel free to contact us.", your_name: "Name",
    your_email: "Email", subject: "Subject", your_message: "Message", send_message: "Send Message",
    whats_new: "New in KURD DOWN",
    top_games: "Top Games",
    top_software: "Top Software",
    game_stat: "Game",
    software_stat: "Software",
    rate_this_item: "Rate this item:",
    comments_section_title: "Comments",
    comment_placeholder: "Write your comment here...",
    name_placeholder: "Your name (optional)",
    post_comment_btn: "Post Comment",
    rating_feedback_part1: "Thanks! You rated it ",
    rating_feedback_part2: " stars.",
    no_comments_yet: "No comments yet. Be the first!",
     filter_all: "All",
    filter_pc: "PC",
    filter_playstation: "Playstation",
    filter_xbox: "Xbox",
    filter_montage: "Editing",
    filter_mobile: "Mobile",
    filter_office: "Office",
    filter_system: "System",
    filter_programming: "Programming",
filter_drivers: "Drivers",
filter_antivirus: "Antivirus",
filter_extensions: "Browser Extensions",
 "genres_title": "Game Genres",
        "filter_all_genres": "All Genres",
        "genre_action": "Action",
        "genre_adventure": "Adventure",
        "genre_rpg": "RPG",
        "genre_strategy": "Strategy",
        "genre_sports": "Sports",
        "genre_racing": "Racing",
        "genre_fighting": "Fighting",
        "genre_horror": "Horror",
        "genre_shooter": "Shooter",
        "filter_by_genre": "Filter by Genre",
"hero_whats_new": "What's New",
        "hero_see_more": "See More",
        "adblock_title": "Please Disable AdBlocker",
        "adblock_message": "We rely on ads to keep our services running. Please whitelist our website and then click the refresh button.",
        "adblock_button": "Refresh Page",
        
        // === الترجمات الجديدة لأزرار الفئات ===
        "cat_all_software": "All Software",
        "cat_racing": "Racing",
        "cat_sports": "Sports",
        "cat_action": "Action",
        "cat_montage": "Editing",
        "cat_system": "System Tools",
        "android_page_title": "Android Apps",
        "ios_page_title": "iPhone Apps",
        "categories": "Categories",
        "genre_tools": "Tools",
        "genre_social": "Social",
        "genre_media": "Media",
        "genre_games": "Games (Mobile)",

 slide_1_title: "Console Games",
    slide_1_desc: "Discover the latest games for PlayStation and Xbox platforms.",
    slide_2_title: "Professional Software",
    slide_2_desc: "All the productivity and design software you need for your computer.",
    slide_3_title: "Top PC Games",
    slide_3_desc: "Embark on new adventures with the largest library of PC games.",
    slide_btn: "Explore Now",

    // نصوص صفحة التحميل
    download_page_title: "Download Program", about_program: "About Program", version: "Version",
    size: "Size", total_downloads: "Total Downloads", category: "Category",
    direct_download: "Direct Download Link", click_to_download: "Click the button below to start the download.",
    download_now: "Download", download_done: "Done!", no_link: "No Link", secure_link: "Secure Link"
}
};

document.addEventListener('DOMContentLoaded', () => {
    // === هذا هو الجزء الذي كان ناقصاً ===
    const languageManager = {
        currentLanguage: localStorage.getItem('kurdin_language') || 'ku',
        
        getTranslation: function(key) {
    return translations[this.currentLanguage]?.[key] || key;
},
        
        init: function() { 
            this.applyLanguage(); 
            this.setupListeners(); 
        },
        
        applyLanguage: function() {
    // حفظ اللغة وتحديث اتجاه الصفحة
    localStorage.setItem('kurdin_language', this.currentLanguage);
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = (this.currentLanguage === 'ar' || this.currentLanguage === 'ku') ? 'rtl' : 'ltr';

    // ترجمة كل العناصر
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translations[this.currentLanguage]?.[key];
        
        if (translation !== undefined) { // نتأكد من وجود الترجمة (حتى لو كانت فارغة)
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                // ===> الإصلاح الحاسم والنهائي هنا <===
                // 1. نفرّغ محتوى العنصر بالكامل
                element.innerHTML = ''; 
                // 2. نضيف الترجمة الجديدة
                element.appendChild(document.createTextNode(translation));
            }
        }
    });

    // تحديث عنوان الصفحة
    const pageTitleKey = document.body.getAttribute('data-page-title');
    if (pageTitleKey) {
        const titleTranslation = translations[this.currentLanguage]?.[pageTitleKey];
        if (titleTranslation) {
            document.title = titleTranslation + " - KURD DOWN";
        }
    }
    
    // تحديث الأزرار النشطة
    if (typeof updateActiveLangButtons === 'function') {
        updateActiveLangButtons();
    }
},

        setupListeners: function() {
            const languageBtn = document.getElementById('languageBtn');
            const languageDropdown = document.getElementById('languageDropdown');
            
            if (languageBtn && languageDropdown) {
                languageBtn.addEventListener('click', (e) => { 
                    e.stopPropagation();
                    languageDropdown.classList.toggle('show'); 
                });

                document.addEventListener('click', (e) => { 
                    if (!languageBtn.contains(e.target)) {
                        languageDropdown.classList.remove('show');
                    }
                });
            }

            document.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    const lang = option.getAttribute('data-lang');
                    if (this.currentLanguage !== lang) {
                        this.currentLanguage = lang; 
                        localStorage.setItem('kurdin_language', lang);
                        this.applyLanguage();
                    }
                    if (languageDropdown) {
                        languageDropdown.classList.remove('show');
                    }
                });
            });
        }
    };
    
    window.languageManager = languageManager;
    languageManager.init();
});