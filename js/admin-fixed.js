// Admin Panel JavaScript with Firebase Integration - Fixed Version

// DOM Elements
const loginSection = document.getElementById('loginSection');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminSidebar = document.getElementById('adminSidebar');

// Navigation
const navLinks = document.querySelectorAll('.admin-nav .nav-link');
const adminSections = document.querySelectorAll('.admin-section');

// Current user
let currentUser = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to load
    setTimeout(() => {
        initializeAdmin();
    }, 1000);
});

// Initialize admin functionality
function initializeAdmin() {
    // Check authentication state
    if (window.authManager) {
        window.authManager.onAuthStateChanged((user) => {
            currentUser = user;
            if (user) {
                showDashboard();
                loadDashboardData();
            } else {
                showLogin();
            }
        });
    }
    
    // Initialize event listeners
    initializeEventListeners();
}

// Event Listeners
function initializeEventListeners() {
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Add program form
    const addProgramForm = document.getElementById('addProgramForm');
    if (addProgramForm) {
        addProgramForm.addEventListener('submit', handleAddProgram);
    }
    
    // Search and filters
    const programSearch = document.getElementById('programSearch');
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (programSearch) {
        programSearch.addEventListener('input', filterPrograms);
    }
    
    if (platformFilter) {
        platformFilter.addEventListener('change', filterPrograms);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterPrograms);
    }

    // File upload handlers
    const imageUpload = document.getElementById('imageUpload');
    const programFileUpload = document.getElementById('programFileUpload');
    
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    if (programFileUpload) {
        programFileUpload.addEventListener('change', handleProgramFileUpload);
    }
}

// Login handling with Firebase Auth
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        showLoading('جاري تسجيل الدخول...');
        
        if (window.authManager) {
            await window.authManager.signIn(email, password);
            hideLoginError();
        } else {
            throw new Error('Firebase Auth not available');
        }
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'المستخدم غير موجود';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'كلمة المرور غير صحيحة';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'البريد الإلكتروني غير صحيح';
        }
        
        showLoginError(errorMessage);
    } finally {
        hideLoading();
    }
}

// Logout handling
async function handleLogout() {
    try {
        if (window.authManager) {
            await window.authManager.signOut();
        }
        showNotification('تم تسجيل الخروج بنجاح', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('حدث خطأ أثناء تسجيل الخروج', 'error');
    }
}

// Show/Hide sections
function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (adminDashboard) adminDashboard.classList.remove('hidden');
}

function showLogin() {
    if (loginSection) loginSection.style.display = 'flex';
    if (adminDashboard) adminDashboard.classList.add('hidden');
}

function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.add('show');
    }
}

function hideLoginError() {
    if (loginError) {
        loginError.classList.remove('show');
    }
}

// Navigation handling
function handleNavigation(e) {
    e.preventDefault();
    
    const targetSection = e.currentTarget.dataset.section;
    
    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Show target section
    adminSections.forEach(section => section.classList.remove('active'));
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
        targetElement.classList.add('active');
    }
    
    // Load section-specific data
    loadSectionData(targetSection);
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load program counts
        await updateProgramCounts();
        
        // Load top programs
        await loadTopPrograms();
        
        // Load total downloads
        await updateTotalDownloads();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update program counts - FIXED VERSION
async function updateProgramCounts() {
    try {
        if (window.dbManager) {
            const allPrograms = await window.dbManager.getAllPrograms();
            
            const windowsCount = allPrograms.filter(p => p.platform === 'windows').length;
            const androidCount = allPrograms.filter(p => p.platform === 'android').length;
            const iosCount = allPrograms.filter(p => p.platform === 'ios').length;
            const totalCount = allPrograms.length;
            
            // Update admin dashboard counts
            updateCountElement('windowsCount', windowsCount);
            updateCountElement('androidCount', androidCount);
            updateCountElement('iosCount', iosCount);
            updateCountElement('totalPrograms', totalCount);
            
            // Update hero stats on main page if available
            if (window.updateHeroStats) {
                window.updateHeroStats(totalCount, allPrograms);
            }
        }
    } catch (error) {
        console.error('Error updating program counts:', error);
    }
}

// Update total downloads
async function updateTotalDownloads() {
    try {
        if (window.dbManager) {
            const totalDownloads = await window.dbManager.getTotalDownloadsCount();
            updateCountElement('totalDownloads', totalDownloads);
        }
    } catch (error) {
        console.error('Error updating total downloads:', error);
    }
}

// Helper function to update count elements
function updateCountElement(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = count.toLocaleString('ar-SA');
    }
}

// Load top programs
async function loadTopPrograms() {
    const topProgramsList = document.getElementById('topProgramsList');
    if (!topProgramsList) return;
    
    try {
        let programs = [];
        
        if (window.dbManager) {
            programs = await window.dbManager.getRecentPrograms(5);
        }
        
        if (programs.length === 0) {
            topProgramsList.innerHTML = '<p class="no-data">لا توجد برامج حالياً</p>';
            return;
        }
        
        topProgramsList.innerHTML = programs.map(program => `
            <div class="top-program-item">
                <div class="program-info">
                    <h4>${program.name}</h4>
                    <span class="platform-badge ${program.platform}">
                        <i class="fab fa-${getPlatformIcon(program.platform)}"></i>
                        ${getPlatformName(program.platform)}
                    </span>
                </div>
                <div class="program-downloads">
                    ${(program.downloads || 0).toLocaleString('ar-SA')} تحميل
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading top programs:', error);
        topProgramsList.innerHTML = '<p class="error-message">حدث خطأ في تحميل البيانات</p>';
    }
}

// Load section-specific data
function loadSectionData(section) {
    switch (section) {
        case 'programs':
            loadProgramsTable();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'users':
            loadUsers();
            break;
        default:
            break;
    }
}

// Load programs table
async function loadProgramsTable() {
    const tableBody = document.getElementById('programsTableBody');
    if (!tableBody) return;
    
    try {
        showTableLoading(tableBody);
        
        let programs = [];
        
        if (window.dbManager) {
            programs = await window.dbManager.getAllPrograms();
        }
        
        if (programs.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="no-data">لا توجد برامج حالياً</td></tr>';
            return;
        }
        
        tableBody.innerHTML = programs.map(program => `
            <tr>
                <td>
                    <img src="${program.image || 'images/default-app.png'}" alt="${program.name}" class="program-image" onerror="this.src='images/default-app.png'">
                </td>
                <td>${program.name}</td>
                <td>
                    <span class="platform-badge ${program.platform}">
                        <i class="fab fa-${getPlatformIcon(program.platform)}"></i>
                        ${getPlatformName(program.platform)}
                    </span>
                </td>
                <td>${getCategoryName(program.category)}</td>
                <td>${(program.downloads || 0).toLocaleString('ar-SA')}</td>
                <td>${formatDate(program.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editProgram('${program.id}')" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteProgram('${program.id}')" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading programs table:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="error-message">حدث خطأ في تحميل البيانات</td></tr>';
    }
}

// Show table loading state
function showTableLoading(tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-cell">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>جاري تحميل البيانات...</span>
                </div>
            </td>
        </tr>
    `;
}

const CLOUDINARY_CLOUD_NAME = 'dgjlcqfr3';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset';

// Handle image upload - FIXED VERSION (Cloudinary)
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('يرجى اختيار ملف صورة صحيح', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
        return;
    }
    
    try {
        showLoading('جاري رفع الصورة...');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image to Cloudinary');
        }
        
        const data = await response.json();
        const imageUrl = data.secure_url;
            
        // Update preview
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.src = imageUrl;
            preview.style.display = 'block';
        }
        
        // Store URL for form submission
        e.target.dataset.uploadedUrl = imageUrl;
        
        showNotification('تم رفع الصورة بنجاح', 'success');
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('حدث خطأ أثناء رفع الصورة', 'error');
    } finally {
        hideLoading();
    }
}

// Handle program file upload - FIXED VERSION (Cloudinary)
async function handleProgramFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
        showNotification('حجم الملف يجب أن يكون أقل من 100 ميجابايت', 'error');
        return;
    }
    
    try {
        showLoading('جاري رفع الملف...');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload file to Cloudinary');
        }
        
        const data = await response.json();
        const fileUrl = data.secure_url;
            
        // Store URL for form submission
        e.target.dataset.uploadedUrl = fileUrl;
        
        // Update file size display
        const sizeInput = document.getElementById('size');
        if (sizeInput) {
            sizeInput.value = formatFileSize(file.size);
        }
        
        showNotification('تم رفع الملف بنجاح', 'success');
    } catch (error) {
        console.error('Error uploading program file:', error);
        showNotification('حدث خطأ أثناء رفع الملف', 'error');
    } finally {
        hideLoading();
    }
}

// Handle add program form - FIXED VERSION
async function handleAddProgram(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Get uploaded file URLs
    const imageUpload = document.getElementById('imageUpload');
    const programFileUpload = document.getElementById('programFileUpload');
    
    // Validate required fields
    const name = formData.get('name');
    const platform = formData.get('platform');
    const category = formData.get('category');
    const description = formData.get('description');
    
    if (!name || !platform || !category || !description) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const programData = {
        name: name.trim(),
        platform: platform,
        category: category,
        version: formData.get('version') || '1.0',
        description: description.trim(),
        image: imageUpload?.dataset.uploadedUrl || formData.get('image') || '',
        downloadUrl: programFileUpload?.dataset.uploadedUrl || formData.get('downloadUrl') || '',
        size: formData.get('size') || 'غير محدد',
        featured: formData.get('featured') === 'on',
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 0
    };
    
    try {
        showLoading('جاري إضافة البرنامج...');
        
        if (window.dbManager) {
            const programId = await window.dbManager.addProgram(programData);
            showNotification('تم إضافة البرنامج بنجاح', 'success');
            
            // Reset form
            e.target.reset();
            
            // Clear uploaded file references
            if (imageUpload) delete imageUpload.dataset.uploadedUrl;
            if (programFileUpload) delete programFileUpload.dataset.uploadedUrl;
            
            // Hide image preview
            const preview = document.getElementById('imagePreview');
            if (preview) preview.style.display = 'none';
            
            // Refresh programs table if visible
            if (document.getElementById('programs')?.classList.contains('active')) {
                loadProgramsTable();
            }
            
            // Update dashboard counts
            updateProgramCounts();
            
            // Update main site data
            if (window.loadProgramsData) {
                window.loadProgramsData();
            }
            
            console.log('Program added successfully with ID:', programId);
        } else {
            throw new Error('Database manager not available');
        }
    } catch (error) {
        console.error('Error adding program:', error);
        showNotification('حدث خطأ أثناء إضافة البرنامج: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Filter programs
function filterPrograms() {
    const searchTerm = document.getElementById('programSearch')?.value.toLowerCase() || '';
    const platformFilter = document.getElementById('platformFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
    const rows = document.querySelectorAll('#programsTableBody tr');
    
    rows.forEach(row => {
        const name = row.cells[1]?.textContent.toLowerCase() || '';
        const platform = row.querySelector('.platform-badge')?.classList[1] || '';
        const category = row.cells[3]?.textContent || '';
        
        const matchesSearch = name.includes(searchTerm);
        const matchesPlatform = !platformFilter || platform === platformFilter;
        const matchesCategory = !categoryFilter || category.includes(getCategoryName(categoryFilter));
        
        if (matchesSearch && matchesPlatform && matchesCategory) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Program actions
function editProgram(programId) {
    // Navigate to edit form
    showNotification('ميزة التحرير قيد التطوير', 'info');
}

async function deleteProgram(programId) {
    if (!confirm('هل أنت متأكد من حذف هذا البرنامج؟')) {
        return;
    }
    
    try {
        showLoading('جاري حذف البرنامج...');
        
        if (window.dbManager) {
            await window.dbManager.deleteProgram(programId);
            showNotification('تم حذف البرنامج بنجاح', 'success');
            loadProgramsTable();
            updateProgramCounts();
            
            // Update main site data
            if (window.loadProgramsData) {
                window.loadProgramsData();
            }
        } else {
            throw new Error('Database manager not available');
        }
    } catch (error) {
        console.error('Error deleting program:', error);
        showNotification('حدث خطأ أثناء حذف البرنامج', 'error');
    } finally {
        hideLoading();
    }
}

// Utility functions
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

function getCategoryName(category) {
    const names = {
        'productivity': 'الإنتاجية',
        'games': 'الألعاب',
        'multimedia': 'الوسائط',
        'utilities': 'الأدوات',
        'security': 'الأمان',
        'development': 'التطوير',
        'design': 'التصميم',
        'education': 'التعليم',
        'social': 'التواصل الاجتماعي',
        'shopping': 'التسوق',
        'health': 'الصحة',
        'finance': 'المالية',
        'travel': 'السفر',
        'lifestyle': 'نمط الحياة'
    };
    return names[category] || category;
}

function formatDate(date) {
    if (!date) return 'غير محدد';
    
    if (date.toDate) {
        // Firestore timestamp
        date = date.toDate();
    } else if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('ar-SA');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Loading and notification functions
function showLoading(message = 'جاري التحميل...') {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <i class="fas fa-spinner fa-spin"></i>
                <span class="loader-message">${message}</span>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        loader.querySelector('.loader-message').textContent = message;
    }
    loader.style.display = 'flex';
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load analytics (placeholder)
function loadAnalytics() {
    console.log('Loading analytics...');
    // TODO: Implement analytics dashboard
}

// Load users (placeholder)
function loadUsers() {
    console.log('Loading users...');
    // TODO: Implement user management
}

// Show add program section
function showAddProgram() {
    // Navigate to add program section
    const addProgramLink = document.querySelector('[data-section="add-program"]');
    if (addProgramLink) {
        addProgramLink.click();
    }
}

// CSS for notifications and loading
const adminStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-lg);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    min-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-color: var(--success-color);
    color: var(--success-color);
}

.notification.error {
    border-color: var(--error-color);
    color: var(--error-color);
}

.notification.info {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.global-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loader-content {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-primary);
}

.loader-content i {
    font-size: 2rem;
    color: var(--primary-color);
}

.top-program-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.top-program-item:last-child {
    border-bottom: none;
}

.top-program-item .program-info h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.program-downloads {
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 600;
}

.program-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: var(--radius-sm);
}

.loading-cell {
    text-align: center;
    padding: 2rem;
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
}

.no-data, .error-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.error-message {
    color: var(--error-color);
}

#imagePreview {
    max-width: 200px;
    max-height: 200px;
    margin-top: 1rem;
    border-radius: var(--radius-md);
    display: none;
}
`;

// Add admin styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

