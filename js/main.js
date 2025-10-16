// Main JavaScript functionality for KURDIN

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const searchInput = document.getElementById('searchInput');
const programsGrid = document.getElementById('programsGrid');
const filterTabs = document.querySelectorAll('.filter-tab');

// Sidebar functionality
function toggleSidebar() {
    sidebar.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
        closeSidebar();
    }
});

// Mobile menu toggle
if (menuToggle && nav) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const navList = nav.querySelector('.nav-list');
        if (navList) {
            navList.classList.toggle('active');
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navList = nav?.querySelector('.nav-list');
    if (navList && navList.classList.contains('active') && 
        !nav.contains(e.target) && 
        !menuToggle?.contains(e.target)) {
        navList.classList.remove('active');
    }
});

// Filter tabs functionality
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Filter programs based on selected tab
        const filter = tab.dataset.filter;
        if (filter === 'all') {
            // For 'all' tab on homepage, load featured programs
            window.loadProgramsData(null, true).then(programs => {
                window.displayPrograms(programs);
            }).catch(error => {
                console.error('Error loading featured programs:', error);
                window.KURDIN?.showError('حدث خطأ أثناء تحميل البرامج المميزة.');
            });
        } else {
            // For platform tabs, load programs for that platform
            window.loadProgramsData(filter).then(programs => {
                window.displayPrograms(programs);
            }).catch(error => {
                console.error(`Error loading ${filter} programs:`, error);
                window.KURDIN?.showError(`حدث خطأ أثناء تحميل برامج ${filter}.`);
            });
        }
    });
});

// Search functionality
function searchPrograms() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        const title = card.querySelector('.program-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.program-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
        }
    });
}

// Real-time search
if (searchInput) {
    searchInput.addEventListener('input', searchPrograms);
}

// // Filter programs by platform
// function filterPrograms(filter) {
//     const programCards = document.querySelectorAll(".program-card");

//     programCards.forEach(card => {
//         const platform = card.dataset.platform;

//         if (filter === "all" || platform === filter) {
//             card.style.display = "block";
//             card.classList.add("fade-in-up");
//         } else {
//             card.style.display = "none";
//         }
//     });
// }

// Category filter functionality
document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        filterByCategory(category);
        closeSidebar();
    });
});

function filterByCategory(category) {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.platform-card, .feature-card, .program-card').forEach(el => {
    observer.observe(el);
});

// Loading state management
function showLoading() {
    if (programsGrid) {
        programsGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>جاري تحميل البرامج...</span>
            </div>
        `;
    }
}

function hideLoading() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
}

// Create program card HTML
function createProgramCard(program) {
    return `
        <div class="program-card" data-platform="${program.platform}" data-category="${program.category}" data-program-id="${program.id}">
            <div class="program-image" onclick="goToDownloadPage('${program.id}')" style="cursor: pointer;">
                <img src="${program.image}" alt="${program.name}" loading="lazy">
            </div>
            <div class="program-info">
                <h3 class="program-title">${program.name}</h3>
                <p class="program-description">${program.description}</p>
                <div class="program-meta">
                    <div class="program-platform">
                        <i class="fab fa-${getPlatformIcon(program.platform)}"></i>
                        <span>${getPlatformName(program.platform)}</span>
                    </div>
                    <button class="download-btn" onclick="downloadProgram('${program.id}')">
                        <i class="fas fa-download"></i>
                        تحميل
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function getPlatformIcon(platform) {
    const icons = {
        'windows': 'windows',
        'android': 'android',
        'ios': 'apple'
    };
    return icons[platform] || 'desktop';
}

function getPlatformName(platform) {
    const names = {
        'windows': 'ويندوز',
        'android': 'أندرويد',
        'ios': 'آيفون'
    };
    return names[platform] || platform;
}

// Download program function
function downloadProgram(programId) {
    // Redirect to download page
    window.open(`download.html?id=${programId}`, '_blank');
}

// Error handling
function showError(message) {
    if (programsGrid) {
        programsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page loads
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });
    
    // Initialize tooltips if needed
    initializeTooltips();
});

// Tooltip functionality
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes sidebar
    if (e.key === 'Escape') {
        closeSidebar();
    }
    
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Export functions for use in other files
window.KurdTech = {
    toggleSidebar,
    closeSidebar,
    searchPrograms,
    filterPrograms,
    downloadProgram,
    showLoading,
    hideLoading,
    showError,
    createProgramCard
};



// Function to navigate to download page
function goToDownloadPage(programId) {
    if (programId) {
        window.location.href = `download.html?id=${programId}`;
    }
}

// Add click event listeners to program cards
document.addEventListener('DOMContentLoaded', function() {
    // Add event delegation for dynamically loaded program cards
    document.addEventListener('click', function(e) {
        const programCard = e.target.closest('.program-card');
        const programImage = e.target.closest('.program-image');
        
        if (programCard && (programImage || e.target.classList.contains('program-card'))) {
            const programId = programCard.dataset.programId || programCard.getAttribute('data-program-id');
            if (programId) {
                goToDownloadPage(programId);
            } else {
                // If no program ID, try to get it from the program title or other attributes
                const programTitle = programCard.querySelector('.program-title')?.textContent;
                if (programTitle) {
                    // Create a simple ID from the title for demo purposes
                    const simpleId = programTitle.toLowerCase().replace(/\s+/g, '-');
                    goToDownloadPage(simpleId);
                }
            }
        }
    });
});

// Make program cards clickable
function makeProgramCardsClickable() {
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        // Add click event if not already added
        if (!card.hasAttribute('data-click-added')) {
            card.addEventListener('click', function(e) {
                // Prevent default if clicking on download button
                if (e.target.closest('.download-btn')) {
                    return;
                }
                
                const programId = this.dataset.programId || this.getAttribute('data-program-id');
                if (programId) {
                    goToDownloadPage(programId);
                } else {
                    // Fallback: use program title to create ID
                    const programTitle = this.querySelector('.program-title')?.textContent;
                    if (programTitle) {
                        const simpleId = programTitle.toLowerCase().replace(/\s+/g, '-');
                        goToDownloadPage(simpleId);
                    }
                }
            });
            card.setAttribute('data-click-added', 'true');
        }
    });
}

// Call this function whenever programs are loaded
if (typeof window.displayPrograms === 'function') {
    const originalDisplayPrograms = window.displayPrograms;
    window.displayPrograms = function(programs) {
        originalDisplayPrograms.call(this, programs);
        // Make cards clickable after they're displayed
        setTimeout(makeProgramCardsClickable, 100);
    };
}

// Also call it on page load for any existing cards
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(makeProgramCardsClickable, 500);
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
        // عند الضغط على زر القائمة
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // منع إغلاق القائمة فوراً
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // عند الضغط خارج القائمة لإغلاقها
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        // عند الضغط على رابط داخل القائمة، أغلق القائمة
        nav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
});