// ====================================================================================
// ===   KURD DOWN - Admin Panel Script - V-FINAL (Complete & Corrected Code)     ===
// ====================================================================================

// --- 1. متغيرات عامة وإعدادات ---
let programsChart = null;
let programsTableCache = [];
const CLOUDINARY_CLOUD_NAME = "dgjlcqfr3"; 
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";

// --- 2. نقطة البداية الرئيسية للتطبيق ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard && !dashboard.classList.contains('hidden')) {
        initializeDashboard();
    }
});

function initializeDashboard() {
    console.log("لوحة التحكم جاهزة، يتم الآن تشغيل كل وظائفها...");
    setupNavigationAndActions();
    loadSectionData('dashboard'); 
}

// --- 3. دوال المصادقة (Authentication) ---
async function handleLogin(e) {
    e.preventDefault();
    Swal.fire({ title: 'جاري التحقق...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: document.getElementById('username').value, password: document.getElementById('password').value })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'فشل الاتصال بالخادم');
        if (result.success) {
            Swal.close();
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('adminDashboard').classList.remove('hidden');
            initializeDashboard();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire('خطأ!', error.message, 'error');
    }
}

async function handleLogout() {
    try {
        await fetch("api/logout.php");
        window.location.reload();
    } catch (error) {
        Swal.fire('خطأ', 'فشل تسجيل الخروج', 'error');
    }
}

// --- 4. دوال التنقل وإدارة الواجهة ---
function setupNavigationAndActions() {
    const switchSection = (sectionId) => {
        document.querySelectorAll('.admin-nav .nav-link.active, .mobile-bottom-nav .nav-link.active').forEach(l => l.classList.remove('active'));
        document.querySelector(`.admin-sidebar .nav-link[data-section="${sectionId}"]`)?.classList.add('active');
        document.querySelector(`.mobile-bottom-nav .nav-link[data-section="${sectionId}"]`)?.classList.add('active');
        document.querySelectorAll('.admin-section.active').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            loadSectionData(sectionId);
        }
    };
    document.querySelectorAll('.admin-nav .nav-link, .mobile-bottom-nav .nav-link').forEach(link => {
        link.addEventListener('click', (e) => { 
            e.preventDefault();
            switchSection(link.dataset.section);
            document.getElementById('adminSidebar')?.classList.remove('open');
        });
    });
    const sidebar = document.getElementById('adminSidebar');
    document.getElementById('mobileMenuToggle')?.addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeSidebarBtn')?.addEventListener('click', () => sidebar.classList.remove('open'));
    
    document.getElementById('addProgramForm')?.addEventListener('submit', handleAddOrUpdateProgram);
    document.getElementById('editProgramForm')?.addEventListener('submit', handleAddOrUpdateProgram);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('openAddMobileAppModalBtn')?.addEventListener('click', () => openModal('addMobileAppModal'));
    document.getElementById('addMobileAppForm')?.addEventListener('submit', handleAddOrUpdateProgram);
    document.getElementById('editMobileAppForm')?.addEventListener('submit', handleAddOrUpdateProgram);
    
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        const modalId = btn.closest('.modal-overlay').id;
        btn.addEventListener('click', () => closeModal(modalId));
    });

    setupCategoryDropdowns('addProgramForm');
    setupCategoryDropdowns('editProgramForm');
    setupCategoryDropdowns('addMobileAppForm');
    setupCategoryDropdowns('editMobileAppForm');

    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
}

function loadSectionData(sectionId) {
    if (sectionId === 'dashboard') loadDashboardData();
    if (sectionId === 'programs') { loadProgramsTable(); setupAdminFilters(); }
    if (sectionId === 'analytics') loadAnalyticsData();
    if (sectionId === 'ios-management') loadMobileAppsTable();
}

// --- 5. دوال لوحة التحكم الرئيسية ---
async function loadDashboardData() {
    const gamesCountEl = document.getElementById('gamesCount');
    const softwareCountEl = document.getElementById('softwareCount');
    if (!gamesCountEl || !softwareCountEl) return;
    try {
        const response = await fetch('api/get_all_programs.php');
        if (!response.ok) throw new Error('Failed to fetch data');
        const programs = await response.json();
        programsTableCache = programs;
        const gamesCount = programs.filter(p => p.mainCategory === 'games').length;
        const softwareCount = programs.filter(p => p.mainCategory === 'software').length;
        gamesCountEl.textContent = gamesCount;
        softwareCountEl.textContent = softwareCount;
        updateChart([gamesCount, softwareCount]);
        loadRecentPrograms();
    } catch (err) {
        console.error("Dashboard Error:", err);
    }
}

function updateChart(data) {
    const ctx = document.getElementById('programsChart')?.getContext('2d');
    if (!ctx) return;
    if (programsChart) programsChart.destroy();
    programsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ألعاب', 'برامج'],
            datasets: [{ data, backgroundColor: ['#3b82f6', '#10b981'], borderColor: '#1f2937', borderWidth: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#f9fafb', font: { size: 14 } } } } }
    });
}

function loadRecentPrograms() {
    const listElement = document.getElementById('recentProgramsList');
    if (!listElement) return;
    const sortedPrograms = [...programsTableCache].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentPrograms = sortedPrograms.slice(0, 5);
    if (recentPrograms.length === 0) {
        listElement.innerHTML = `<li>لا توجد برامج مضافة حديثاً.</li>`;
        return;
    }
    listElement.innerHTML = recentPrograms.map(p => `<li><img src="${p.image || 'images/default-program.png'}"><div class="program-info"><span class="program-title">${p.name}</span><span class="program-category">${p.mainCategory}</span></div></li>`).join('');
}

// --- 6. دوال إدارة المحتوى ---
async function loadProgramsTable() {
    const tableBody = document.getElementById('programsTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">جاري التحميل...</td></tr>`;
    try {
        if (programsTableCache.length === 0) {
            const response = await fetch('api/get_all_programs.php');
            programsTableCache = await response.json();
        }
        filterAdminPrograms();
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:red;">${err.message}</td></tr>`;
    }
}

function setupAdminFilters() {
    document.getElementById('adminSearchInput')?.addEventListener('input', filterAdminPrograms);
    document.querySelectorAll('#programs .main-filters .filter-btn').forEach(button => button.addEventListener('click', () => {
        document.querySelector('#programs .main-filters .filter-btn.active')?.classList.remove('active');
        button.classList.add('active');
        filterAdminPrograms();
    }));
}

function filterAdminPrograms() {
    const searchTerm = document.getElementById('adminSearchInput')?.value.toLowerCase() || "";
    const activeMainFilter = document.querySelector('#programs .main-filters .filter-btn.active')?.dataset.mainFilter || "all";
    const pcPrograms = programsTableCache.filter(p => p.mainCategory === 'games' || p.mainCategory === 'software');
    
    const filteredPrograms = pcPrograms.filter(p => {
        const nameMatch = (p.name || '').toLowerCase().includes(searchTerm);
        const mainCategoryMatch = (activeMainFilter === 'all') || (p.mainCategory === activeMainFilter);
        return nameMatch && mainCategoryMatch;
    });
    renderProgramsTable(filteredPrograms);
}

function renderProgramsTable(programs) {
    const tableBody = document.getElementById('programsTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = programs.length ? programs.map(p => `
        <tr>
            <td><img src="${p.image || 'images/default-program.png'}"></td>
            <td>${p.name||''}</td>
            <td><span class="platform-badge ${p.mainCategory}">${p.mainCategory}</span> (${p.category || 'N/A'})</td>
            <td>${p.downloads||0}</td>
            <td>${formatDate(p.createdAt)}</td>
            <td>
                <button class="action-btn edit" onclick="openEditModal('${p.id}')">تعديل</button>
                <button class="action-btn delete" onclick="deleteProgram('${p.id}')">حذف</button>
            </td>
        </tr>
    `).join('') : `<tr><td colspan="6" class="text-center">لا توجد نتائج.</td></tr>`;
}

// --- 7. دوال إدارة الموبايل ---
async function loadMobileAppsTable() {
    const tableBody = document.getElementById('mobileAppsTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">جاري التحميل...</td></tr>`;
    try {
        const response = await fetch('api/get_all_programs.php');
        const allPrograms = await response.json();
        programsTableCache = allPrograms;
        const mobileApps = allPrograms.filter(p => p.mainCategory === 'ios' || p.mainCategory === 'android');
        
        if (mobileApps.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">لا توجد تطبيقات موبايل مضافة.</td></tr>`;
            return;
        }
        tableBody.innerHTML = mobileApps.map(app => `
            <tr>
                <td><img src="${app.image || 'images/default-program.png'}"></td>
                <td>${app.name}</td>
                <td><span class="platform-badge ${app.mainCategory}">${app.mainCategory}</span></td>
                <td>${app.category || 'N/A'}</td>
                <td>${app.downloads || 0}</td>
                <td>
                    <button class="action-btn edit" onclick="openEditMobileAppModal('${app.id}')">تعديل</button>
                    <button class="action-btn delete" onclick="deleteProgram('${app.id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:red;">${error.message}</td></tr>`;
    }
}

// --- 8. دوال الإضافة والتعديل والحذف ---
async function handleAddOrUpdateProgram(e) {
    e.preventDefault();
    const form = e.target;
    const isEditing = form.id.startsWith('edit');
    const apiUrl = isEditing ? 'api/update_program.php' : 'api/add_program.php';
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = isEditing ? 'جاري الحفظ...' : 'جاري الإضافة...';
    try {
        const formData = new FormData(form);
        const response = await fetch(apiUrl, { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        Swal.fire({ icon: 'success', title: 'نجاح!', text: result.message, timer: 2000, showConfirmButton: false });
        if (isEditing) {
            closeModal(form.closest('.modal-overlay').id);
        } else if (form.id === 'addMobileAppForm') {
            closeModal('addMobileAppForm');
        } else { 
            form.reset();
            document.querySelector('[data-section="programs"]').click(); 
        }
        loadProgramsTable();
        loadMobileAppsTable();
        loadDashboardData();
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: error.message });
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

async function deleteProgram(id) {
    const result = await Swal.fire({ title: 'هل أنت متأكد؟', text: "لن تتمكن من استعادة هذا العنصر!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonText: 'إلغاء', confirmButtonText: 'نعم، قم بالحذف!' });
    if (result.isConfirmed) {
        try {
            const formData = new FormData();
            formData.append('id', id);
            const response = await fetch('api/delete_program.php', { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).message);
            Swal.fire('تم الحذف!', 'تم حذف العنصر بنجاح.', 'success');
            loadProgramsTable();
            loadMobileAppsTable();
            loadDashboardData();
        } catch (err) {
            Swal.fire('خطأ!', 'فشل حذف العنصر.', 'error');
        }
    }
}

async function openEditModal(id) {
    const form = document.getElementById('editProgramForm');
    openModal('editModalOverlay');
    form.reset();
    form.querySelector('h3').textContent = "جاري تحميل البيانات...";
    try {
        const response = await fetch(`api/get_program_details.php?id=${id}`);
        if (!response.ok) throw new Error('فشل جلب البيانات.');
        const p = await response.json();
        form.querySelector('h3').textContent = "تعديل العنصر";
        form.id.value = p.id; 
        form.name.value = p.name || '';
        form.mainCategory.value = p.mainCategory || 'software';
        setupCategoryDropdowns('editProgramForm', p.mainCategory);
        if (p.mainCategory === 'games') form.game_category.value = p.category || 'PC';
        else if (p.mainCategory === 'software') form.software_category.value = p.category || 'system';
        form.version.value = p.version || ''; 
        form.description.value = p.description || '';
        form.image.value = p.image || '';
        document.getElementById('editImagePreview').src = p.image || 'images/default-program.png';
        form.downloadUrl.value = p.downloadUrl || ''; 
        form.size.value = p.size || '';
        form.downloadUrl2.value = p.downloadUrl2 || '';
        form.videoUrl.value = p.videoUrl || '';
        form.featured.checked = p.featured == '1';
    } catch(err) {
        Swal.fire('خطأ', "فشل تحميل بيانات التعديل: " + err.message, 'error');
        closeModal('editModalOverlay');
    }
}

async function openEditMobileAppModal(id) {
    const form = document.getElementById('editMobileAppForm');
    openModal('editMobileAppModal');
    form.reset();
    form.querySelector('h3').textContent = "جاري تحميل بيانات التطبيق...";
    try {
        const response = await fetch(`api/get_program_details.php?id=${id}`);
        if (!response.ok) throw new Error(`فشل جلب البيانات (Status: ${response.status})`);
        const p = await response.json();
        if (!p || !p.id) throw new Error("البيانات المستلمة من الخادم غير صالحة.");
        
        form.querySelector('h3').textContent = "تعديل تطبيق الموبايل";
        
        form.id.value = p.id; 
        form.name.value = p.name || '';
        form.mainCategory.value = p.mainCategory || 'android';
        form.category.value = p.category || 'tools';
        form.version.value = p.version || ''; 
        form.image.value = p.image || '';
        document.getElementById('editMobileImagePreview').src = p.image || 'images/default-program.png';
        form.downloadUrl.value = p.downloadUrl || ''; 

    } catch(err) {
        Swal.fire('خطأ', "فشل تحميل بيانات التعديل: " + err.message, 'error');
        closeModal('editMobileAppModal');
    }
}

// --- 9. دوال قسم التحليلات ---
async function loadAnalyticsData() {
    const totalDownloadsEl = document.getElementById('totalDownloadsCount');
    const topProgramsBody = document.getElementById('topProgramsTableBody');
    if (!topProgramsBody || !totalDownloadsEl) return;
    try {
        const response = await fetch('api/get_analytics.php');
        if (!response.ok) throw new Error('فشل جلب البيانات');
        const data = await response.json();
        totalDownloadsEl.textContent = data.totalDownloads.toLocaleString();
        topProgramsBody.innerHTML = data.topPrograms.length ? data.topPrograms.map((p, index) => `<tr><td class="rank-cell">${index + 1}</td><td><img src="${p.image || ''}"></td><td>${p.name}</td><td>${p.mainCategory}</td><td class="downloads-cell">${p.downloads.toLocaleString()}</td></tr>`).join('') : `<tr><td colspan="5" class="text-center">لا توجد بيانات.</td></tr>`;
    } catch (err) {
        totalDownloadsEl.textContent = "خطأ";
        topProgramsBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:red;">${err.message}</td></tr>`;
    }
}

// --- 10. دالة رفع الملفات الذكية ---
function handleFileUpload(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const form = fileInput.closest('form');
    const targetUrlInputName = fileInput.dataset.targetUrlInput;
    const targetUrlInput = form.querySelector(`[name="${targetUrlInputName}"]`);
    const previewElementId = fileInput.dataset.previewElement;
    const previewElement = form.querySelector(`#${previewElementId}`);
    
    let progressContainer = form.querySelector('#uploadProgressContainer');
    if (!progressContainer) {
        progressContainer = form.querySelector('#editUploadProgressContainer') || form.querySelector('#editMobileUploadProgressContainer');
    }

    if (!file) {
        if (targetUrlInput) targetUrlInput.required = true;
        if (progressContainer) progressContainer.style.display = 'none';
        return;
    }
    
    if (targetUrlInput) targetUrlInput.required = false;

    if (previewElement && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => { previewElement.src = e.target.result; };
        reader.readAsDataURL(file);
    }
    
    if (!progressContainer || !targetUrlInput) return;

    progressContainer.innerHTML = `<div class="progress-wrapper"><progress value="0" max="100"></progress><button type="button" class="cancel-upload-btn">&times;</button></div><span class="progress-text">0% - جاري التحضير...</span>`;
    progressContainer.style.display = 'block';

    const progressBar = progressContainer.querySelector('progress');
    const progressText = progressContainer.querySelector('.progress-text');
    const cancelBtn = progressContainer.querySelector('.cancel-upload-btn');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const xhr = new XMLHttpRequest();

    cancelBtn.onclick = () => {
        xhr.abort();
        progressText.textContent = "تم إلغاء الرفع.";
        fileInput.value = "";
        targetUrlInput.value = "";
        if (targetUrlInput) targetUrlInput.required = true;
        if (previewElement) previewElement.src = 'images/default-program.png';
        setTimeout(() => { progressContainer.style.display = 'none'; }, 2000);
    };
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, true);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) { const percentComplete = Math.round((e.loaded / e.total) * 100); progressBar.value = percentComplete; progressText.textContent = `${percentComplete}% - جاري الرفع...`; } };
    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            targetUrlInput.value = response.secure_url;
            progressText.textContent = "✅ تم الرفع بنجاح!";
            cancelBtn.style.display = 'none';
        } else {
            progressText.textContent = "❌ فشل الرفع!";
            Swal.fire('خطأ', 'فشل رفع الملف: ' + xhr.responseText, 'error');
            if (previewElement) previewElement.src = 'images/default-program.png';
        }
    };
    xhr.onerror = () => {
        progressText.textContent = "❌ فشل الرفع!";
        Swal.fire('خطأ', 'حدث خطأ في الشبكة أثناء الرفع.', 'error');
        if (previewElement) previewElement.src = 'images/default-program.png';
    };
    xhr.send(formData);
}

// --- 11. دوال مساعدة (Helpers) ---
function openModal(modalId) { document.getElementById(modalId)?.classList.add('active'); document.body.classList.add('modal-active'); }
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            form.querySelectorAll('.file-input').forEach(input => {
                const targetUrlInput = form.querySelector(`[name="${input.dataset.targetUrlInput}"]`);
                if (targetUrlInput) {
                    targetUrlInput.required = true;
                }
            });
            form.querySelectorAll('[id*="ProgressContainer"]').forEach(container => { if(container) container.style.display = 'none' });
            form.querySelectorAll('img[id*="Preview"]').forEach(img => { if(img) img.src = 'images/default-program.png' });
        }
    }
}
function setupCategoryDropdowns(formId, activeCategory = null) {
    const form = document.getElementById(formId);
    if (!form) return;
    const mainCategorySelect = form.querySelector('[name="mainCategory"]');
    const updateVisibility = (selectedValue) => {
        form.querySelectorAll('.subcategory-group').forEach(group => {
            const shouldBeVisible = group.dataset.mainCategory === selectedValue;
            group.style.display = shouldBeVisible ? 'block' : 'none';
            group.querySelectorAll('input, select').forEach(input => input.disabled = !shouldBeVisible);
        });
    };
    if (mainCategorySelect) {
        mainCategorySelect.addEventListener('change', (e) => updateVisibility(e.target.value));
        updateVisibility(activeCategory || mainCategorySelect.value);
    }
}
function formatDate(dateString) { if (!dateString) return 'N/A'; return new Date(dateString.replace(' ', 'T')).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }); }