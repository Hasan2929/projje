// Sample data for KurdTech website

// Sample programs data organized by platform
const samplePrograms = {
    windows: [
        {
            id: 'win_001',
            name: 'Adobe Photoshop 2024',
            description: 'برنامج تحرير الصور الاحترافي الأشهر في العالم مع أدوات متقدمة للتصميم والإبداع',
            platform: 'windows',
            category: 'design',
            version: '25.0.0',
            size: '2.8 GB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg',
            downloadUrl: 'https://www.adobe.com/products/photoshop.html',
            featured: true,
            downloads: 15420,
            rating: 4.8,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
        },
        {
            id: 'win_002',
            name: 'Visual Studio Code',
            description: 'محرر الأكواد المجاني والقوي من مايكروسوفت مع دعم لجميع لغات البرمجة',
            platform: 'windows',
            category: 'development',
            version: '1.85.0',
            size: '95 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
            downloadUrl: 'https://code.visualstudio.com/',
            featured: true,
            downloads: 12850,
            rating: 4.9,
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-12')
        },
        {
            id: 'win_003',
            name: 'VLC Media Player',
            description: 'مشغل الوسائط المجاني الذي يدعم جميع صيغ الفيديو والصوت',
            platform: 'windows',
            category: 'multimedia',
            version: '3.0.20',
            size: '45 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/VLC_Icon.svg',
            downloadUrl: 'https://www.videolan.org/vlc/',
            featured: false,
            downloads: 9870,
            rating: 4.7,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10')
        },
        {
            id: 'win_004',
            name: 'Microsoft Office 2021',
            description: 'حزمة المكتب الشاملة من مايكروسوفت تشمل Word وExcel وPowerPoint',
            platform: 'windows',
            category: 'productivity',
            version: '2021',
            size: '4.2 GB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_Office_2013_logo.svg',
            downloadUrl: 'https://www.microsoft.com/office',
            featured: true,
            downloads: 18950,
            rating: 4.6,
            createdAt: new Date('2024-01-08'),
            updatedAt: new Date('2024-01-08')
        },
        {
            id: 'win_005',
            name: 'CCleaner',
            description: 'أداة تنظيف وتحسين النظام لحذف الملفات المؤقتة وتسريع الكمبيوتر',
            platform: 'windows',
            category: 'utilities',
            version: '6.18',
            size: '35 MB',
            image: 'https://upload.wikimedia.org/wikipedia/en/3/39/CCleaner_Logo.png',
            downloadUrl: 'https://www.ccleaner.com/',
            featured: false,
            downloads: 7650,
            rating: 4.4,
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-05')
        },
        {
            id: 'win_006',
            name: 'Steam',
            description: 'منصة الألعاب الرقمية الأشهر في العالم مع آلاف الألعاب',
            platform: 'windows',
            category: 'games',
            version: '2024.1',
            size: '2.5 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
            downloadUrl: 'https://store.steampowered.com/',
            featured: true,
            downloads: 22100,
            rating: 4.8,
            createdAt: new Date('2024-01-03'),
            updatedAt: new Date('2024-01-03')
        }
    ],
    
    android: [
        {
            id: 'and_001',
            name: 'WhatsApp Messenger',
            description: 'تطبيق المراسلة الأشهر عالمياً للدردشة ومشاركة الملفات والمكالمات',
            platform: 'android',
            category: 'social',
            version: '2.24.1.78',
            size: '65 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
            downloadUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
            featured: true,
            downloads: 45200,
            rating: 4.2,
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20')
        },
        {
            id: 'and_002',
            name: 'Instagram',
            description: 'شارك الصور والفيديوهات والقصص مع أصدقائك ومتابعيك',
            platform: 'android',
            category: 'social',
            version: '312.0.0.37.103',
            size: '45 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
            downloadUrl: 'https://play.google.com/store/apps/details?id=com.instagram.android',
            featured: true,
            downloads: 38750,
            rating: 4.1,
            createdAt: new Date('2024-01-18'),
            updatedAt: new Date('2024-01-18')
        },
        {
            id: 'and_003',
            name: 'TikTok',
            description: 'شاهد وأنشئ مقاطع فيديو قصيرة ممتعة ومسلية',
            platform: 'android',
            category: 'social',
            version: '32.8.4',
            size: '180 MB',
            image: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
            downloadUrl: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically',
            featured: true,
            downloads: 42300,
            rating: 4.3,
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16')
        },
        {
            id: 'and_004',
            name: 'PUBG Mobile',
            description: 'لعبة المعركة الملكية الأشهر على الهواتف الذكية',
            platform: 'android',
            category: 'games',
            version: '3.0.0',
            size: '2.8 GB',
            image: 'https://upload.wikimedia.org/wikipedia/en/b/b1/PUBG_Mobile_logo.jpg',
            downloadUrl: 'https://play.google.com/store/apps/details?id=com.tencent.ig',
            featured: true,
            downloads: 28900,
            rating: 4.5,
            createdAt: new Date('2024-01-14'),
            updatedAt: new Date('2024-01-14')
        },
        {
            id: 'and_005',
            name: 'Spotify',
            description: 'استمع إلى ملايين الأغاني والبودكاست مجاناً',
            platform: 'android',
            category: 'multimedia',
            version: '8.8.96.488',
            size: '35 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
            downloadUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
            featured: false,
            downloads: 19650,
            rating: 4.4,
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-12')
        },
        {
            id: 'and_006',
            name: 'Microsoft Office',
            description: 'تطبيق المكتب المحمول لإنشاء وتحرير المستندات',
            platform: 'android',
            category: 'productivity',
            version: '16.0.17126.20132',
            size: '280 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_Office_2013_logo.svg',
            downloadUrl: 'https://play.google.com/store/apps/details?id=com.microsoft.office.officehubrow',
            featured: false,
            downloads: 15420,
            rating: 4.3,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10')
        }
    ],
    
    ios: [
        {
            id: 'ios_001',
            name: 'Procreate',
            description: 'تطبيق الرسم الرقمي الاحترافي للآيباد والآيفون',
            platform: 'ios',
            category: 'design',
            version: '5.3.4',
            size: '450 MB',
            image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/7c/0c/8c/7c0c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
            downloadUrl: 'https://apps.apple.com/app/procreate/id425073498',
            featured: true,
            downloads: 8950,
            rating: 4.9,
            createdAt: new Date('2024-01-19'),
            updatedAt: new Date('2024-01-19')
        },
        {
            id: 'ios_002',
            name: 'Notion',
            description: 'مساحة عمل شاملة للملاحظات والمشاريع والتعاون',
            platform: 'ios',
            category: 'productivity',
            version: '0.6.38',
            size: '120 MB',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
            downloadUrl: 'https://apps.apple.com/app/notion-notes-docs-tasks/id1232780281',
            featured: true,
            downloads: 12400,
            rating: 4.8,
            createdAt: new Date('2024-01-17'),
            updatedAt: new Date('2024-01-17')
        },
        {
            id: 'ios_003',
            name: 'Apollo for Reddit',
            description: 'أفضل تطبيق لتصفح Reddit مع واجهة أنيقة ومميزات متقدمة',
            platform: 'ios',
            category: 'social',
            version: '1.15.11',
            size: '85 MB',
            image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a2/a2/a2/a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
            downloadUrl: 'https://apps.apple.com/app/apollo-for-reddit/id979274575',
            featured: true,
            downloads: 6750,
            rating: 4.7,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
        },
        {
            id: 'ios_004',
            name: 'Genshin Impact',
            description: 'لعبة مغامرات عالم مفتوح مع رسومات خلابة وقصة مثيرة',
            platform: 'ios',
            category: 'games',
            version: '4.4.0',
            size: '18 GB',
            image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/b1/b1/b1/b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
            downloadUrl: 'https://apps.apple.com/app/genshin-impact/id1517783697',
            featured: false,
            downloads: 9200,
            rating: 4.6,
            createdAt: new Date('2024-01-13'),
            updatedAt: new Date('2024-01-13')
        },
        {
            id: 'ios_005',
            name: 'VSCO',
            description: 'تطبيق تحرير الصور مع فلاتر احترافية وأدوات متقدمة',
            platform: 'ios',
            category: 'multimedia',
            version: '302.0',
            size: '180 MB',
            image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/c1/c1/c1/c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
            downloadUrl: 'https://apps.apple.com/app/vsco-photo-video-editor/id588013838',
            featured: false,
            downloads: 5480,
            rating: 4.4,
            createdAt: new Date('2024-01-11'),
            updatedAt: new Date('2024-01-11')
        },
        {
            id: 'ios_006',
            name: 'Duolingo',
            description: 'تعلم اللغات بطريقة ممتعة وتفاعلية مع دروس يومية قصيرة',
            platform: 'ios',
            category: 'education',
            version: '6.154.0',
            size: '320 MB',
            image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/d1/d1/d1/d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
            downloadUrl: 'https://apps.apple.com/app/duolingo/id570060128',
            featured: false,
            downloads: 7890,
            rating: 4.7,
            createdAt: new Date('2024-01-09'),
            updatedAt: new Date('2024-01-09')
        }
    ]
};

// Categories data
const categories = {
    productivity: {
        name: 'الإنتاجية',
        icon: 'fas fa-briefcase',
        description: 'برامج وتطبيقات تساعد في العمل والإنتاجية'
    },
    games: {
        name: 'الألعاب',
        icon: 'fas fa-gamepad',
        description: 'أحدث الألعاب والترفيه'
    },
    multimedia: {
        name: 'الوسائط',
        icon: 'fas fa-photo-video',
        description: 'برامج الصوت والفيديو والصور'
    },
    utilities: {
        name: 'الأدوات',
        icon: 'fas fa-tools',
        description: 'أدوات النظام والصيانة'
    },
    security: {
        name: 'الأمان',
        icon: 'fas fa-shield-alt',
        description: 'برامج الحماية والأمان'
    },
    development: {
        name: 'التطوير',
        icon: 'fas fa-code',
        description: 'أدوات البرمجة والتطوير'
    },
    design: {
        name: 'التصميم',
        icon: 'fas fa-palette',
        description: 'برامج التصميم والإبداع'
    },
    education: {
        name: 'التعليم',
        icon: 'fas fa-graduation-cap',
        description: 'تطبيقات التعلم والتعليم'
    },
    social: {
        name: 'التواصل الاجتماعي',
        icon: 'fas fa-users',
        description: 'تطبيقات التواصل والدردشة'
    },
    shopping: {
        name: 'التسوق',
        icon: 'fas fa-shopping-cart',
        description: 'تطبيقات التسوق الإلكتروني'
    },
    health: {
        name: 'الصحة',
        icon: 'fas fa-heartbeat',
        description: 'تطبيقات الصحة واللياقة'
    },
    finance: {
        name: 'المالية',
        icon: 'fas fa-dollar-sign',
        description: 'تطبيقات البنوك والمالية'
    },
    travel: {
        name: 'السفر',
        icon: 'fas fa-plane',
        description: 'تطبيقات السفر والسياحة'
    },
    lifestyle: {
        name: 'نمط الحياة',
        icon: 'fas fa-heart',
        description: 'تطبيقات الحياة اليومية'
    }
};

// Platform data
const platforms = {
    windows: {
        name: 'ويندوز',
        icon: 'fab fa-windows',
        color: '#0078d4',
        description: 'برامج وتطبيقات نظام التشغيل ويندوز'
    },
    android: {
        name: 'أندرويد',
        icon: 'fab fa-android',
        color: '#3ddc84',
        description: 'تطبيقات وألعاب نظام أندرويد'
    },
    ios: {
        name: 'آيفون',
        icon: 'fab fa-apple',
        color: '#007aff',
        description: 'تطبيقات وألعاب نظام iOS'
    }
};

// Statistics data
const siteStats = {
    totalPrograms: 281,
    totalDownloads: 125430,
    totalUsers: 8950,
    totalCategories: 14,
    weeklyGrowth: {
        programs: 25,
        downloads: 3420,
        users: 180
    }
};

// Featured programs (cross-platform)
const featuredPrograms = [
    samplePrograms.windows[0], // Adobe Photoshop
    samplePrograms.android[0], // WhatsApp
    samplePrograms.ios[1],     // Notion
    samplePrograms.windows[1], // VS Code
    samplePrograms.android[3], // PUBG Mobile
    samplePrograms.ios[0]      // Procreate
];

// Export functions for use in other files
function getAllPrograms() {
    return [
        ...samplePrograms.windows,
        ...samplePrograms.android,
        ...samplePrograms.ios
    ];
}

function getProgramsByPlatform(platform) {
    return samplePrograms[platform] || [];
}

function getProgramsByCategory(category) {
    const allPrograms = getAllPrograms();
    return allPrograms.filter(program => program.category === category);
}

function getFeaturedPrograms(limit = 6) {
    return featuredPrograms.slice(0, limit);
}

function searchPrograms(searchTerm) {
    const allPrograms = getAllPrograms();
    const term = searchTerm.toLowerCase();
    
    return allPrograms.filter(program => 
        program.name.toLowerCase().includes(term) ||
        program.description.toLowerCase().includes(term)
    );
}

function getProgramById(id) {
    const allPrograms = getAllPrograms();
    return allPrograms.find(program => program.id === id);
}

function getCategoryInfo(categoryKey) {
    return categories[categoryKey];
}

function getPlatformInfo(platformKey) {
    return platforms[platformKey];
}

function getSiteStats() {
    return siteStats;
}

// Initialize sample data in localStorage for offline use
function initializeSampleData() {
    if (!localStorage.getItem('kurdtech_sample_data')) {
        localStorage.setItem('kurdtech_sample_data', JSON.stringify({
            programs: samplePrograms,
            categories: categories,
            platforms: platforms,
            stats: siteStats,
            featured: featuredPrograms
        }));
    }
}

// Load sample data from localStorage
function loadSampleData() {
    const data = localStorage.getItem('kurdtech_sample_data');
    return data ? JSON.parse(data) : null;
}

// Export for global use
window.SampleData = {
    getAllPrograms,
    getProgramsByPlatform,
    getProgramsByCategory,
    getFeaturedPrograms,
    searchPrograms,
    getProgramById,
    getCategoryInfo,
    getPlatformInfo,
    getSiteStats,
    initializeSampleData,
    loadSampleData,
    samplePrograms,
    categories,
    platforms,
    siteStats,
    featuredPrograms
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
});

