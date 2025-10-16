// =========================================================================
// === الكود الكامل والمحسّن لملف js/download.js (مع ميزات SEO والتحسينات) ===
// =========================================================================

// Event listener to start the entire process once the page is ready
document.addEventListener("DOMContentLoaded", initializeDownloadPage);

/**
 * Main function to orchestrate the download page initialization.
 */
async function initializeDownloadPage() {
    const loader = document.getElementById("loader");
    const contentWrapper = document.getElementById("download-content");
    const programId = new URLSearchParams(window.location.search).get("id");

    if (!programId) {
        window.location.href = "index.php";
        return;
    }

    try {
        // Step 1: Fetch program details
        const program = await fetchProgramDetails(programId);
        
        // Step 2: If successful, display details and set up interactions
        displayProgramDetails(program);
        setupDownloadButton(program);
        
        // Step 3: Fetch and display comments
        const comments = await fetchComments(programId);
        displayComments(comments);

        // Step 4: Initialize the interactive parts (rating and comment submission)
        initializeInteraction(programId);

        // Step 5: Hide loader and show content
        loader.style.display = "none";
        contentWrapper.classList.remove("hidden");

    } catch (error) {
        // If anything fails, show an error message
        loader.innerHTML = `<p style="color:var(--error-color); text-align:center;">${error.message}</p>`;
        console.error("Initialization failed:", error);
    }
}

/**
 * Fetches the details for a single program from the public API.
 * @param {string} id - The ID of the program.
 * @returns {Promise<object>} A promise that resolves with the program object.
 */
async function fetchProgramDetails(id) {
    const response = await fetch(`api/get_public_program_details.php?id=${id}`);
    if (!response.ok) {
        throw new Error("بەرنامەکە نەدۆزرایەوە یان بەردەست نییە."); // Program not found or unavailable
    }
    const data = await response.json();
    if (!data || !data.id) {
        throw new Error("هەڵەیەک لە وەرگرتنی زانیارییەکانی بەرنامەکە ڕوویدا."); // Error receiving program data
    }
    return data;
}

/**
 * Fetches all comments for a specific program from the public API.
 * @param {string} programId - The ID of the program.
 * @returns {Promise<Array>} A promise that resolves with an array of comment objects.
 */
async function fetchComments(programId) {
    try {
        const response = await fetch(`api/get_comments_public.php?program_id=${programId}`);
        if (!response.ok) {
            console.error("Server responded with an error while fetching comments.");
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Network error while fetching comments:", error);
        return [];
    }
}

/**
 * Displays the main program details on the page and updates SEO elements.
 * @param {object} program - The program data object.
 */
/**
 * دالة لعرض تفاصيل البرنامج الرئيسية في الصفحة وتحديث عناصر الـ SEO.
 * @param {object} program - كائن بيانات البرنامج.
 */
/**
 * دالة لعرض تفاصيل البرنامج الرئيسية في الصفحة وتحديث عناصر الـ SEO (نسخة التشخيص).
 * @param {object} program - كائن بيانات البرنامج.
 */
function displayProgramDetails(program) {
    console.log("1. بدء دالة displayProgramDetails لبرنامج:", program.name);

    // أولاً، دع ملف الترجمة يقوم بترجمة كل العناصر الثابتة في الصفحة
    if (window.languageManager && typeof window.languageManager.applyLanguage === 'function') {
        console.log("2. تم العثور على languageManager. سيتم تطبيق اللغة الآن...");
        window.languageManager.applyLanguage();
        console.log("3. بعد تطبيق اللغة، العنوان الحالي هو:", document.title);
    } else {
        console.log("2. لم يتم العثور على languageManager.");
    }

    // --- تحسينات SEO (الجزء الأهم) ---
    // ثانياً، نقوم الآن بوضع العنوان الديناميكي النهائي.
    const dynamicTitle = `تحميل ${program.name || 'البرنامج'} - KURD DOWN`;
    document.title = dynamicTitle;
    console.log("4. تم تعيين العنوان النهائي إلى:", document.title);

    // --- تحديث الوصف التعريفي (Meta Description) ---
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = `رابط التحميل المباشر لـ ${program.name}. الإصدار: ${program.version || 'غير متوفر'}. الحجم: ${program.size || 'غير متوفر'}.`;
    console.log("5. تم تحديث الوصف التعريفي.");

    // (بقية الكود الخاص بك لتحديث عناصر الصفحة يبقى كما هو)
    const elementsToUpdate = {
        "program-icon": (el) => {
            el.src = program.image || 'images/default-program.png';
            el.alt = program.name;
        },
        "program-name": (el) => el.textContent = program.name || "غير متوفر",
        "program-description": (el) => el.textContent = program.description || "لا توجد تفاصيل متوفرة.",
        "program-version": (el) => el.textContent = program.version || "غير متوفر",
        "program-size": (el) => el.textContent = program.size || "غير متوفر",
        "program-downloads": (el) => el.textContent = (program.downloads || 0).toLocaleString(),
        "program-category": (el) => el.textContent = program.category || "غير متوفر",
        "program-platform": (el) => el.textContent = program.mainCategory === "games" ? "لعبة" : "برنامج"
    };
    for (const id in elementsToUpdate) {
        const el = document.getElementById(id);
        if (el) elementsToUpdate[id](el);
    }
    updateOptionalElement('videoContainer', program.videoUrl, (container) => {
        const videoId = getYouTubeVideoId(program.videoUrl);
        if (videoId) {
            document.getElementById("programVideo").src = `https://www.youtube.com/embed/${videoId}`;
            container.style.display = "block";
        }
    });
    updateOptionalElement('downloadButton2', program.downloadUrl2, (button) => {
        button.href = program.downloadUrl2;
        button.style.display = 'flex';
    });
    console.log("6. انتهت عملية عرض التفاصيل في الصفحة.");
}

    // Re-apply language translations if the manager is available
    if (window.languageManager) {
        window.languageManager.applyLanguage();
    }



/**
 * الدالة النهائية والمبسطة لإعداد بيانات التحميل.
 * @param {object} program - كائن يحتوي على تفاصيل البرنامج.
 */
function setupDownloadButton(program) {
    const downloadLabel = document.querySelector(".download-button-container .label");
    
    if (!downloadLabel) return;
    
    if (!program.downloadUrl) {
        downloadLabel.classList.add("disabled");
        return;
    }

    // === الإصلاح: سنقوم بتخزين البيانات ليستخدمها HTML مباشرة ===
    downloadLabel.setAttribute('data-download-url', program.downloadUrl);
    downloadLabel.setAttribute('data-program-name', program.name);
    downloadLabel.setAttribute('data-program-image', program.image);
    downloadLabel.setAttribute('data-program-id', program.id);
}



/**
 * الدالة الجديدة التي سيتم استدعاؤها مباشرة من HTML.
 * @param {HTMLElement} element - الزر الذي تم النقر عليه.
 */
function handleDownloadClick(element) {
    // منع أي نقرات متعددة
    if (element.classList.contains('disabled-after-click')) return;
    element.classList.add('disabled-after-click');

    // جلب البيانات المخزنة من الزر
    const url = element.getAttribute('data-download-url');
    const name = element.getAttribute('data-program-name');
    const image = element.getAttribute('data-program-image');
    const id = element.getAttribute('data-program-id'); // الأهم

    // تشغيل الأنيميشن
    const downloadCheckbox = document.getElementById("download-checkbox");
    if(downloadCheckbox) downloadCheckbox.checked = true;

    // ====> الجزء الجديد والأهم: زيادة عدد التحميلات <====
    if (id) {
        // نرسل طلب "fire-and-forget" إلى الخادم لزيادة العداد
        fetch(`api/increment_download.php?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`Server error incrementing download count for ID ${id}.`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(`Download count for program ${id} incremented successfully.`);
                } else {
                    console.error(`Failed to increment download count for program ${id}.`);
                }
            })
            .catch(err => console.error('Network error while incrementing download count:', err));
    }

    // تجهيز الرابط لصفحة الانتظار
    const encodedUrl = encodeURIComponent(url);
    const encodedName = encodeURIComponent(name);
    const encodedImage = encodeURIComponent(image);

    // الانتقال إلى صفحة الانتظار بعد تأخير (لإعطاء وقت للأنيميشن)
    setTimeout(() => {
        // ====> تمرير الـ ID هنا أيضاً كإجراء احتياطي <====
        window.open(`wait.php?url=${encodedUrl}&name=${encodedName}&image=${encodedImage}&id=${id}`, '_blank');
        
        // إعادة تفعيل الزر بعد فترة للسماح بالتحميل مرة أخرى
        setTimeout(() => {
            element.classList.remove('disabled-after-click');
            if(downloadCheckbox) downloadCheckbox.checked = false;
        }, 5000);
    }, 3000);
}

/**
 * Initializes interactive elements like rating stars and comment submission form.
 * @param {string} programId - The ID of the current program.
 */
function initializeInteraction(programId) {
    const starsContainer = document.getElementById("stars-container");
    const feedbackEl = document.getElementById("rating-feedback");
    const commentInput = document.getElementById("comment-input");
    const nameInput = document.getElementById("comment-name-input");
    const submitBtn = document.getElementById("submit-comment-btn");

    if (!starsContainer || !submitBtn) return;

    let currentRating = 0;
    const stars = Array.from(starsContainer.querySelectorAll("i"));

    const updateStars = (ratingValue) => {
        stars.forEach((star, index) => {
            star.classList.toggle("fas", index < ratingValue);
            star.classList.toggle("far", index >= ratingValue);
        });
    };

    starsContainer.addEventListener("click", (e) => {
        const ratingValue = e.target.dataset.value;
        if (!ratingValue) return;
        currentRating = parseInt(ratingValue, 10);
        updateStars(currentRating);
        // Using language manager for translatable feedback
        if (window.languageManager) {
            feedbackEl.textContent = `${window.languageManager.getTranslation('rating_feedback_part1')} ${currentRating} ${window.languageManager.getTranslation('rating_feedback_part2')}`;
        } else {
            feedbackEl.textContent = `سوپاس! تۆ ${currentRating} ئەستێرەت دا.`;
        }
    });

    starsContainer.addEventListener("mouseover", (e) => {
        const hoverValue = e.target.dataset.value;
        if (hoverValue) updateStars(hoverValue);
    });

    starsContainer.addEventListener("mouseleave", () => {
        updateStars(currentRating);
    });

    submitBtn.addEventListener("click", async () => {
        const text = commentInput.value.trim();
        const author = nameInput.value.trim() || "Ziyaretvan";

        if (!text) {
            Swal.fire("تکایە!", "تکایە سەرنجەکەت بنووسە!", "warning");
            return;
        }

        const dataToSend = { programId, text, author, rating: currentRating };

        try {
            const response = await fetch("api/add_comment_public.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend)
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            Swal.fire("سوپاس!", "سەرنجەکەت بە سەرکەوتوویی زیادکرا.", "success");
            
            displaySingleComment(result.comment, true); // Add the new comment to the top
            
            // Reset form
            commentInput.value = "";
            nameInput.value = "";
            currentRating = 0;
            updateStars(0);
            feedbackEl.textContent = "";

        } catch (error) {
            Swal.fire("هەڵە!", `هەڵەیەک لە کاتی زیادکردنی سەرنج ڕوویدا: ${error.message}`, "error");
        }
    });
}

/**
 * Renders a list of comments on the page.
 * @param {Array<object>} comments - An array of comment objects.
 */
function displayComments(comments) {
    const commentsList = document.getElementById("comments-list");
    const commentCountEl = document.getElementById("comments-count");

    if (commentCountEl) commentCountEl.textContent = comments.length;
    if (!commentsList) return;

    commentsList.innerHTML = ""; // Clear list before adding new comments

    if (comments.length === 0) {
        commentsList.innerHTML = `<p class="no-comments-message">هێشتا هیچ سەرنجێک نییە. یەکەم کەس بە!</p>`;
    } else {
        comments.forEach(comment => displaySingleComment(comment, false));
    }
}

/**
 * Creates and appends a single comment element to the comments list.
 * @param {object} comment - The comment object to display.
 * @param {boolean} isNew - If true, prepends the comment; otherwise, appends it.
 */
function displaySingleComment(comment, isNew = false) {
    const commentsList = document.getElementById("comments-list");
    if (!commentsList) return;

    // Remove the "no comments" message if it exists
    const noCommentsEl = commentsList.querySelector(".no-comments-message");
    if (noCommentsEl) noCommentsEl.remove();

    const commentEl = document.createElement("div");
    commentEl.className = "comment";

    let ratingStars = "";
    const rating = parseInt(comment.rating, 10) || 0;
    for (let i = 1; i <= 5; i++) {
        ratingStars += `<i class="fa-star ${i <= rating ? "fas" : "far"}"></i>`;
    }
    const date = new Date(comment.createdAt || Date.now());
    const formattedDate = date.toLocaleDateString("ku-IQ", { year: "numeric", month: "long", day: "numeric" });

    commentEl.innerHTML = `
        <i class="fas fa-user-circle comment-avatar"></i>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${escapeHTML(comment.author)}</span>
                <div class="comment-rating">${ratingStars}</div>
            </div>
            <p class="comment-text">${escapeHTML(comment.text)}</p>
            <span class="comment-date">${formattedDate}</span>
        </div>
    `;

    if (isNew) {
        commentsList.prepend(commentEl); // Add new comments at the top
        const commentCountEl = document.getElementById("comments-count");
        if (commentCountEl) commentCountEl.textContent = parseInt(commentCountEl.textContent, 10) + 1;
    } else {
        commentsList.appendChild(commentEl);
    }
}


// --- Helper Functions ---

/**
 * A small utility to handle showing/hiding optional elements.
 * @param {string} elementId - The ID of the container element.
 * @param {*} condition - The value to check (e.g., a URL string).
 * @param {function} callback - The function to run if the condition is met.
 */
function updateOptionalElement(elementId, condition, callback) {
    const element = document.getElementById(elementId);
    if (element) {
        if (condition) {
            callback(element);
        } else {
            element.style.display = "none";
        }
    }
}

/**
 * Extracts YouTube video ID from various URL formats.
 * @param {string} url - The YouTube URL.
 * @returns {string|null} The video ID or null if not found.
 */
function getYouTubeVideoId(url) {
    if (!url) return null;
    const regExp = /^(?:https?:\/\/(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|https?:\/\/(?:www\.)?youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
}

/**
 * Sanitizes HTML string to prevent XSS attacks.
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
}