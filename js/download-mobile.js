// =========================================================================
// ===   الكود الكامل والمحسّن لملف js/download-mobile.js (مع عداد التحميلات)    ===
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    const programId = new URLSearchParams(window.location.search).get("id");
    if (!programId) {
        window.location.href = "mobile.php";
        return;
    }

    async function initializePage() {
        try {
            const program = await fetchProgramDetails(programId);
            displayMobileDetails(program);
            setupMobileDownloadButton(program); // تم تحديث هذه الدالة
        } catch (error) {
            document.body.innerHTML = `<p style="color:red; text-align:center; padding: 2rem;">${error.message}</p>`;
        }
    }

    async function fetchProgramDetails(id) {
        const response = await fetch(`api/get_public_program_details.php?id=${id}`);
        if (!response.ok) throw new Error("Program not found.");
        return await response.json();
    }

    function displayMobileDetails(program) {
        document.title = `${program.name || 'Download'} - KURD DOWN`;
        
        const header = document.querySelector('.program-header');
        if (header && program.image) {
            header.style.setProperty('--program-image-url', `url(${program.image})`);
        }

        document.getElementById("program-name").textContent = program.name || "N/A";
        document.getElementById("program-platform").textContent = program.mainCategory || "N/A";
        document.getElementById("program-description").textContent = program.description || "No description.";
        document.getElementById("program-version").textContent = program.version || "N/A";
        document.getElementById("program-size").textContent = program.size || "N/A";
        // سيعرض العدد الصحيح الآن بعد كل تحميل
        document.getElementById("program-downloads").textContent = (program.downloads || 0).toLocaleString();
        document.getElementById("program-category").textContent = program.category || "N/A";
    }

function setupMobileDownloadButton(program) {
    const downloadContainer = document.getElementById('downloadButtonContainer');
    if (!downloadContainer) return;
    
    const downloadBtn = document.createElement('a');
    downloadBtn.id = 'simple-download-btn';
    downloadBtn.className = 'download-btn-simple';
    downloadBtn.innerHTML = `<i class="fas fa-download"></i><span>داگرتن</span>`;
    
    if (!program.downloadUrl) {
        downloadBtn.classList.add("disabled");
        downloadBtn.href = "#";
    } else {
        downloadBtn.href = "#"; // منع الانتقال المباشر
        
        // إضافة حدث النقر لتشغيل منطق زيادة العداد
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (downloadBtn.classList.contains('disabled')) return;
            downloadBtn.classList.add('disabled');
            downloadBtn.innerHTML = `<span>...چاوەڕێ بە</span>`;

            // ====> الجزء الجديد والأهم: زيادة عدد التحميلات <====
            if (program.id) {
                fetch(`api/increment_download.php?id=${program.id}`)
                    .catch(err => console.error('Error incrementing mobile download count:', err));
            }
            
            // تجهيز الرابط والانتقال لصفحة الانتظار
            const encodedUrl = encodeURIComponent(program.downloadUrl);
            const encodedName = encodeURIComponent(program.name);
            const encodedImage = encodeURIComponent(program.image);
            
            // الانتقال بعد تأخير بسيط
            setTimeout(() => {
                // ====> تمرير الـ ID هنا أيضاً <====
                window.open(`wait.php?url=${encodedUrl}&name=${encodedName}&image=${encodedImage}&id=${program.id}`, '_blank');
                
                // إعادة الزر لحالته الطبيعية بعد فترة
                setTimeout(() => {
                    downloadBtn.classList.remove('disabled');
                    downloadBtn.innerHTML = `<i class="fas fa-download"></i><span>داگرتن</span>`;
                }, 4000);

            }, 500);
        });
    }
    
    downloadContainer.innerHTML = '';
    downloadContainer.appendChild(downloadBtn);
}

    initializePage();
});