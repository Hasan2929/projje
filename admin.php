<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$is_logged_in = isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true;
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KURD DOWN - لوحة الإدارة</title>
    <link rel="stylesheet" href="styles/admin.css?v=FINAL_MOBILE_EDIT"> 
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="admin-body">

    <?php if (!$is_logged_in): ?>
    <div class="login-section" id="loginSection">
        <div class="login-container">
            <div class="login-header"><h2>تسجيل الدخول</h2></div>
            <form class="login-form" id="loginForm">
                <div class="form-group"><label>البريد الإلكتروني</label><input type="email" id="username" required></div>
                <div class="form-group"><label>كلمة المرور</label><input type="password" id="password" required></div>
                <button type="submit" class="login-btn">دخول</button>
            </form>
        </div>
    </div>
    <?php endif; ?>

    <div class="admin-dashboard <?php echo $is_logged_in ? '' : 'hidden'; ?>" id="adminDashboard">
        
        <header class="admin-header">
            <button class="mobile-menu-toggle" id="mobileMenuToggle"><i class="fas fa-bars"></i></button>
            <div class="header-brand-logo">KURD DOWN Admin</div>
            <div class="admin-profile">
                <button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> <span>خروج</span></button>
            </div>
        </header>

        <aside class="admin-sidebar" id="adminSidebar">
            <div class="sidebar-header">
                <div class="admin-logo">KURD DOWN</div>
                <button class="close-sidebar-btn" id="closeSidebarBtn">&times;</button>
            </div>
            <nav class="admin-nav">
                <ul class="nav-list">
                    <li><a href="#" class="nav-link active" data-section="dashboard"><i class="fas fa-tachometer-alt"></i> لوحة التحكم</a></li>
                    <li><a href="#" class="nav-link" data-section="analytics"><i class="fas fa-chart-line"></i> التحليلات</a></li>
                    <li><a href="#" class="nav-link" data-section="programs"><i class="fas fa-tasks"></i> إدارة المحتوى</a></li>
                    <li><a href="#" class="nav-link" data-section="add-program"><i class="fas fa-plus-circle"></i> إضافة محتوى</a></li>
                    <li><a href="#" class="nav-link" data-section="ios-management"><i class="fas fa-mobile-alt"></i> ادارة الموبايل</a></li>
                </ul>
            </nav>
        </aside>

        <main class="admin-main">
            <section class="admin-section active" id="dashboard">
                 <div class="section-header"><h1>لوحة التحكم الرئيسية</h1></div>
                 <div class="stats-grid">
                    <div class="stat-card blue"><div class="stat-icon"><i class="fas fa-gamepad"></i></div><div class="stat-details"><span class="stat-title">ألعاب</span><span id="gamesCount" class="stat-number">0</span></div></div>
                    <div class="stat-card green"><div class="stat-icon"><i class="fas fa-laptop-code"></i></div><div class="stat-details"><span class="stat-title">برامج</span><span id="softwareCount" class="stat-number">0</span></div></div>
                 </div>
                 <div class="dashboard-grid">
                    <div class="chart-container"><h3>توزيع المحتوى</h3><canvas id="programsChart"></canvas></div>
                    <div class="recent-programs"><h3>أحدث الإضافات</h3><ul id="recentProgramsList"><li class="loading-item">جاري التحميل...</li></ul></div>
                 </div>
            </section>
            
            <section class="admin-section" id="ios-management">
               <div class="section-header"><h1>إدارة تطبيقات الموبايل</h1></div>
                <div class="add-new-container">
                    <button class="add-new-btn" id="openAddMobileAppModalBtn"><i class="fas fa-plus"></i> إضافة تطبيق موبايل جديد</button>
                </div>
                <div class="programs-table-container">
                    <table class="programs-table">
                        <thead>
                            <tr>
                                <th>صورة</th>
                                <th>الاسم</th>
                                <th>المنصة</th>
                                <th>الفئة</th>
                                <th>التحميلات</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="mobileAppsTableBody"></tbody>
                    </table>
                </div>
            </section>

            <section class="admin-section" id="analytics">
                 <div class="section-header"><h1>تحليلات الموقع</h1></div>
                <div class="stats-grid">
                    <div class="stat-card blue"><div class="stat-icon"><i class="fas fa-download"></i></div><div class="stat-details"><span class="stat-title">إجمالي التحميلات</span><span id="totalDownloadsCount" class="stat-number">0</span></div></div>
                    <div class="stat-card green"><div class="stat-icon"><i class="fas fa-users"></i></div><div class="stat-details"><span class="stat-title">إجمالي الزوار</span><span class="stat-number">قريباً</span></div></div>
                </div>
                <div class="ga-info-box"><i class="fas fa-info-circle"></i><p>بيانات الزوار تتطلب ربط الموقع بخدمة <strong>Google Analytics</strong>.</p></div>
                <div class="section-header" style="margin-top: 2rem;"><h2>الأكثر تحميلاً</h2></div>
                <div class="programs-table-container"><table class="programs-table"><thead><tr><th>الترتيب</th><th>صورة</th><th>الاسم</th><th>التصنيف</th><th>التحميلات</th></tr></thead><tbody id="topProgramsTableBody"></tbody></table></div>
            </section>

            <section class="admin-section" id="programs">
                <div class="section-header"><h1>إدارة المحتوى (الألعاب والبرامج)</h1></div>
                <div class="program-filters">
                    <div class="search-container"><input type="text" id="adminSearchInput" placeholder="...ابحث بالاسم"><i class="fas fa-search"></i></div>
                    <div class="main-filters">
                        <button class="filter-btn active" data-main-filter="all">الكل</button>
                        <button class="filter-btn" data-main-filter="games">ألعاب</button>
                        <button class="filter-btn" data-main-filter="software">برامج</button>
                    </div>
                </div>
                <div class="programs-table-container">
                    <table class="programs-table">
                        <thead><tr><th>صورة</th><th>الاسم</th><th>التصنيف</th><th>التحميلات</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
                        <tbody id="programsTableBody"></tbody>
                    </table>
                </div>
            </section>
            
            <section class="admin-section" id="add-program">
                 <div class="section-header"><h1>إضافة محتوى جديد (لعبة أو برنامج كمبيوتر)</h1></div>
                 <form id="addProgramForm" class="add-program-form">
                     <div class="form-grid">
                         <div class="form-group"><label>الاسم</label><input type="text" name="name" required></div>
                         <div class="form-group"><label>التصنيف الرئيسي</label>
                             <select name="mainCategory" required>
                                <option value="" disabled selected>...اختر</option>
                                <option value="games">لعبة (كمبيوتر)</option>
                                <option value="software">برنامج (كمبيوتر)</option>
                            </select>
                         </div>
                         <div class="form-group subcategory-group" data-main-category="games" style="display:none;">
                             <label>المنصة</label>
                             <select name="game_category"><option value="PC">PC</option><option value="Playstation">Playstation</option><option value="Xbox">Xbox</option></select>
                         </div>
                         <div class="form-group subcategory-group" data-main-category="software" style="display:none;">
                             <label>التصنيف الفرعي</label>
                             <select name="software_category"><option value="system">برامج النظام</option><option value="montage">مونتاج</option><option value="mobile">موبايل</option><option value="office">اوفيس</option><option value="programming">برمجة</option><option value="drivers">التعريفات</option><option value="antivirus">مكافحة الفيروسات</option><option value="extensions">ملحقات المتصفح</option></select>
                         </div>
                         <div class="form-group"><label>الإصدار</label><input type="text" name="version"></div>
                         <div class="form-group"><label>الحجم</label><input type="text" name="size"></div>
                         <div class="form-group" style="grid-column: 1 / -1;"><label>الوصف</label><textarea name="description" rows="3"></textarea></div>
                         <div class="form-group"><label>الصورة (رابط)</label><input type="url" name="image"></div>
                         <div class="form-group"><label>رابط التحميل الأساسي</label><input type="url" name="downloadUrl"></div>
                         <div class="form-group"><label>رابط التحميل الثاني (اختياري)</label><input type="url" name="downloadUrl2"></div>
                         <div class="form-group"><label>رابط فيديو توضيحي (اختياري)</label><input type="url" name="videoUrl"></div>
                         <div class="form-group" style="grid-column: 1 / -1; align-self: center;">
                             <label class="checkbox-label"><input type="checkbox" name="featured"><span>عرض هذا العنصر في الصفحة الرئيسية (مميز)</span></label>
                         </div>
                     </div>
                     <div class="form-actions"><button type="submit" class="btn-primary">إضافة المحتوى</button></div>
                 </form>
            </section>
        </main>

        <nav class="mobile-bottom-nav">
            <a href="#" class="nav-link active" data-section="dashboard"><i class="fas fa-tachometer-alt"></i><span>الرئيسية</span></a>
            <a href="#" class="nav-link" data-section="programs"><i class="fas fa-tasks"></i><span>المحتوى</span></a>
            <a href="#" class="nav-link" data-section="add-program"><i class="fas fa-plus-circle"></i><span>إضافة</span></a>
            <a href="#" class="nav-link" data-section="ios-management"><i class="fas fa-mobile-alt"></i><span>الموبايل</span></a>
        </nav>
    </div>

    <div class="modal-overlay" id="editModalOverlay">
        <div class="modal-content modal-lg">
            <div class="modal-header"><h3>تعديل العنصر</h3><button class="modal-close-btn">×</button></div>
            <form id="editProgramForm" class="modal-form split-form">
                <input type="hidden" name="id">
                <div class="form-left-panel">
                    <div class="image-uploader">
                        <img id="editImagePreview" src="images/default-program.png" alt="معاينة الصورة">
                        <label for="editImageUpload" class="upload-overlay"><i class="fas fa-camera"></i> تغيير الصورة</label>
                        <input type="file" id="editImageUpload" class="file-input" data-target-url-input="image" data-preview-element="editImagePreview" accept="image/*" style="display: none;">
                    </div>
                    <div class="form-group"><label>رابط الصورة</label><input type="url" name="image" placeholder="أو الصق رابط صورة هنا"></div>
                    <div class="form-group"><label>اسم العنصر</label><input type="text" name="name" required placeholder="مثال: Adobe Photoshop 2024"></div>
                </div>
                <div class="form-right-panel">
                    <div class="form-group"><label>التصنيف الرئيسي</label>
                        <select name="mainCategory" required>
                            <option value="games">لعبة (كمبيوتر)</option><option value="software">برنامج (كمبيوتر)</option>
                        </select>
                    </div>
                    <div class="form-group subcategory-group" data-main-category="games" style="display:none;"><label>المنصة</label><select name="game_category"><option value="PC">PC</option><option value="Playstation">Playstation</option><option value="Xbox">Xbox</option></select></div>
                    <div class="form-group subcategory-group" data-main-category="software" style="display:none;"><label>التصنيف الفرعي</label><select name="software_category"><option value="system">برامج النظام</option><option value="montage">مونتاج</option><option value="mobile">موبايل</option><option value="office">اوفيس</option><option value="programming">برمجة</option><option value="drivers">التعريفات</option><option value="antivirus">مكافحة الفيروسات</option><option value="extensions">ملحقات المتصفح</option></select></div>
                    <div class="form-group"><label>الإصدار</label><input type="text" name="version"></div>
                    <div class="form-group"><label>الحجم</label><input type="text" name="size"></div>
                    <div class="form-group"><label>الوصف</label><textarea name="description" rows="3"></textarea></div>
                    <div class="form-group"><label>رابط التحميل الأساسي</label><input type="url" name="downloadUrl" required></div>
                    <div class="form-group" id="editUploadProgressContainer" style="display: none;"><div class="progress-wrapper"><progress value="0" max="100"></progress><button type="button" class="cancel-upload-btn">&times;</button></div><span class="progress-text"></span></div>
                    <div class="form-group"><label>أو رفع ملف جديد</label><input type="file" class="file-input" data-target-url-input="downloadUrl"></div>
                    <div class="form-group"><label>رابط التحميل الثاني (اختياري)</label><input type="url" name="downloadUrl2"></div>
                    <div class="form-group"><label>رابط الفيديو (اختياري)</label><input type="url" name="videoUrl"></div>
                    <div class="form-group"><label class="checkbox-label"><input type="checkbox" name="featured"><span>عرض هذا العنصر في الصفحة الرئيسية (مميز)</span></label></div>
                    <div class="form-actions"><button type="submit" class="btn-primary">حفظ التغييرات</button></div>
                </div>
            </form>
        </div>
    </div>
    
    <div class="modal-overlay" id="addMobileAppModal">
        <div class="modal-content modal-lg">
            <div class="modal-header"><h3>إضافة تطبيق موبايل جديد</h3><button class="modal-close-btn">×</button></div>
            <form id="addMobileAppForm" class="modal-form split-form">
                <div class="form-left-panel">
                    <div class="image-uploader">
                        <img id="addMobileImagePreview" src="images/default-program.png" alt="معاينة الصورة">
                        <label for="addMobileImageUpload" class="upload-overlay"><i class="fas fa-camera"></i> رفع صورة</label>
                        <input type="file" id="addMobileImageUpload" class="file-input" data-target-url-input="image" data-preview-element="addMobileImagePreview" accept="image/*" style="display: none;">
                    </div>
                    <div class="form-group"><label>رابط الصورة</label><input type="url" name="image" placeholder="أو الصق رابط صورة هنا" required></div>
                    <div class="form-group"><label>اسم التطبيق</label><input type="text" name="name" required placeholder="مثال: Instagram"></div>
                </div>
                <div class="form-right-panel">
                    <div class="form-group"><label>المنصة</label>
                        <select name="mainCategory" required>
                            <option value="android" selected>أندرويد</option>
                            <option value="ios">آيفون</option>
                        </select>
                    </div>
                    <div class="form-group"><label>الفئة (التصنيف)</label>
                        <select name="category" required>
                            <option value="tools">أدوات (Tools)</option>
                            <option value="games">ألعاب (Games)</option>
                            <option value="social">تواصل اجتماعي (Social)</option>
                            <option value="media">وسائط (Media)</option>
                        </select>
                    </div>
                    <div class="form-group"><label>الإصدار</label><input type="text" name="version" placeholder="مثال: 1.2.3"></div>
                    <div class="form-group"><label>رابط ملف IPA/APK</label><input type="url" name="downloadUrl" required></div>
                    <div class="form-group" id="uploadProgressContainer" style="display: none;"><div class="progress-wrapper"><progress value="0" max="100"></progress><button type="button" class="cancel-upload-btn">&times;</button></div><span class="progress-text"></span></div>
                    <div class="form-group"><label>أو رفع ملف من جهازك</label><input type="file" class="file-input" data-target-url-input="downloadUrl"></div>
                    <div class="form-actions"><button type="submit" class="btn-primary">إضافة التطبيق</button></div>
                </div>
            </form>
        </div>
    </div>

    <div class="modal-overlay" id="editMobileAppModal">
        <div class="modal-content modal-lg">
            <div class="modal-header"><h3>تعديل تطبيق الموبايل</h3><button class="modal-close-btn">×</button></div>
            <form id="editMobileAppForm" class="modal-form split-form">
                <input type="hidden" name="id">
                <div class="form-left-panel">
                    <div class="image-uploader">
                        <img id="editMobileImagePreview" src="images/default-program.png" alt="معاينة الصورة">
                        <label for="editMobileImageUpload" class="upload-overlay"><i class="fas fa-camera"></i> تغيير الصورة</label>
                        <input type="file" id="editMobileImageUpload" class="file-input" data-target-url-input="image" data-preview-element="editMobileImagePreview" accept="image/*" style="display: none;">
                    </div>
                    <div class="form-group"><label>رابط الصورة</label><input type="url" name="image" placeholder="أو الصق رابط صورة هنا" required></div>
                    <div class="form-group"><label>اسم التطبيق</label><input type="text" name="name" required></div>
                </div>
                <div class="form-right-panel">
                    <div class="form-group"><label>المنصة</label>
                        <select name="mainCategory" required>
                            <option value="android">أندرويد</option>
                            <option value="ios">آيفون</option>
                        </select>
                    </div>
                    <div class="form-group"><label>الفئة (التصنيف)</label>
                        <select name="category" required>
                            <option value="tools">أدوات (Tools)</option>
                            <option value="games">ألعاب (Games)</option>
                            <option value="social">تواصل اجتماعي (Social)</option>
                            <option value="media">وسائط (Media)</option>
                        </select>
                    </div>
                    <div class="form-group"><label>الإصدار</label><input type="text" name="version"></div>
                    <div class="form-group"><label>رابط ملف IPA/APK</label><input type="url" name="downloadUrl" required></div>
                    <div class="form-group" id="editMobileUploadProgressContainer" style="display: none;">
                        <div class="progress-wrapper"><progress value="0" max="100"></progress><button type="button" class="cancel-upload-btn">&times;</button></div>
                        <span class="progress-text"></span>
                    </div>
                    <div class="form-group"><label>أو رفع ملف جديد</label><input type="file" class="file-input" data-target-url-input="downloadUrl"></div>
                    <div class="form-actions"><button type="submit" class="btn-primary">حفظ التغييرات</button></div>
                </div>
            </form>
        </div>
    </div>
    
    <script src="js/admin.js?v=ULTIMATE_FIX_3"></script>
    
</body>
</html>