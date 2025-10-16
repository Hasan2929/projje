<?php
// الخطوة 1: بدء الجلسة
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// الخطوة 2: استدعاء ملف الاتصال (الذي قمنا بإصلاحه الآن)
require_once __DIR__ . '/api/db_connect.php';

// الخطوة 3: استلام ID البرنامج
$program_id = filter_var($_GET['id'] ?? 0, FILTER_SANITIZE_NUMBER_INT);

// الخطوة 4: زيادة العداد (لن يتم تنفيذه إلا إذا نجح الاتصال في الخطوة 2)
if (isset($conn) && $conn && $program_id > 0 && !isset($_SESSION['incremented_' . $program_id])) {
    try {
        $sql = "UPDATE programs SET downloads = downloads + 1 WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("i", $program_id);
            $stmt->execute();
            $stmt->close();
            $_SESSION['incremented_' . $program_id] = true;
        }
    } catch (Exception $e) {
        // تجاهل الأخطاء بصمت
    }
}

// الخطوة 5: استلام باقي البيانات
$download_url = filter_var($_GET['url'] ?? '', FILTER_SANITIZE_URL);
$program_name = htmlspecialchars($_GET['name'] ?? 'داگرتنەکەت');
$program_image = filter_var($_GET['image'] ?? '', FILTER_SANITIZE_URL);

if (empty($download_url)) {
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ku" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>داگرتنەکەت ئامادە دەبێت... - KURD DOWN</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        @font-face {
            font-family: 'KurdinFont';
            src: url('fonts/NRT-Reg.ttf') format('truetype');
            font-weight: normal; font-style: normal; font-display: swap;
        }
        :root {
            --primary-color: #7b4dff; --primary-glow: rgba(123, 77, 255, 0.5);
            --bg-color: #0a0a14; --text-primary: #e6e6e6; --text-secondary: #9a9aae;
            --glass-bg: rgba(20, 20, 40, 0.5); --glass-border: rgba(255, 255, 255, 0.1);
        }
        body {
            font-family: 'KurdinFont', 'Cairo', sans-serif;
            margin: 0; background-color: var(--bg-color); color: var(--text-primary);
            overflow-x: hidden; display: flex; align-items: center;
            justify-content: center; min-height: 100vh;
        }
        #video-bg {
            position: fixed; top: 50%; left: 50%; min-width: 100%;
            min-height: 100%; width: auto; height: auto; z-index: -2;
            transform: translateX(-50%) translateY(-50%); opacity: 0.1;
        }
        .program-image-wait {
            max-width: 80%; max-height: 150px; border-radius: 16px;
            margin-top: 1.5rem; object-fit: contain;
            border: 2px solid var(--primary-color);
            box-shadow: 0 0 15px rgba(123, 77, 255, 0.4), 0 0 30px rgba(123, 77, 255, 0.3), inset 0 0 10px rgba(123, 77, 255, 0.2);
            animation: fadeInImage 1s ease-out;
        }
        @keyframes fadeInImage { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .video-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(ellipse at center, rgba(10, 10, 20, 0.5) 0%, rgba(10, 10, 20, 1) 100%);
            z-index: -1;
        }
        .wait-container {
            position: relative; z-index: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center; width: 100%;
            max-width: 800px; padding: 2rem; text-align: center;
        }
        .top-ad-box {
            width: 100%; max-width: 728px; min-height: 90px;
            margin-bottom: 2.5rem; margin-top: 1rem;
            display: flex; align-items: center; justify-content: center;
        }
        .main-content-box {
            width: 100%; max-width: 500px; background: var(--glass-bg);
            border: 1px solid var(--glass-border); backdrop-filter: blur(10px);
            border-radius: 24px; padding: 2.5rem; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        h1 {
            font-size: 2.8rem; font-weight: 900; margin: 1rem 0 0.5rem 0; 
            color: var(--primary-color);
            text-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-glow);
            animation: text-flicker 3s linear infinite;
        }
        @keyframes text-flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color), 0 0 30px var(--primary-glow), 0 0 40px var(--primary-glow); }
          20%, 24%, 55% { text-shadow: none; }
        }
        p { font-size: 1.2rem; color: var(--text-secondary); margin: 0; }
        .timer-wrapper { margin: 2rem 0; }
        #countdown { font-size: 5rem; font-weight: 900; color: var(--primary-color); text-shadow: 0 0 20px var(--primary-color); }
        .progress-bar-container { width: 100%; height: 10px; background-color: rgba(0,0,0,0.3); border-radius: 5px; overflow: hidden; margin-top: 1rem; }
        #progress-bar { width: 0%; height: 100%; background: linear-gradient(90deg, var(--primary-color) 0%, #be8eff 100%); border-radius: 5px; transition: width 1s linear; }
    </style>
</head>
<body>
    <video autoplay muted loop id="video-bg">
        <source src="https://cdn.pixabay.com/video/2021/08/20/86102-588319686.mp4" type="video/mp4">
    </video>
    <div class="video-overlay"></div>
    
    <div class="wait-container">
        <div class="top-ad-box">
            <div id="container-9c5380debdd5f5ec178fed5c16a5bea1"></div>
        </div>

        <div class="main-content-box">
            <h1><?php echo $program_name; ?></h1>
            <?php if (!empty($program_image)): ?>
                <img src="<?php echo htmlspecialchars($program_image); ?>" alt="<?php echo $program_name; ?>" class="program-image-wait">
            <?php endif; ?>
            <p>بەستەرەکەت لە ماوەیەکی کەمدا چالاک دەبێت</p>
            <div class="timer-wrapper">
                <span id="countdown">10</span>
            </div>
            <div class="progress-bar-container">
                <div id="progress-bar"></div>
            </div>
        </div>
    </div>

    <script>
        const countdownElement = document.getElementById('countdown');
        const progressBar = document.getElementById('progress-bar');
        const downloadUrl = "<?php echo htmlspecialchars($download_url); ?>";
        const totalTime = 10;
        let timeLeft = totalTime;

        const timer = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;
            const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownElement.textContent = "✅";
                window.location.href = downloadUrl;
            }
        }, 1000);
    </script>
    
    <script>
        document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        document.addEventListener('keydown', function(e) {
            if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey) || e.ctrlKey && e.keyCode == 85) { e.preventDefault(); }
        });
    </script>
    
    <?php include 'ads.php'; ?>

    <div id="adblock-overlay">
        <div id="adblock-modal">
            <div class="adblock-icon"><i class="fas fa-shield-alt"></i></div>
            <h2 data-translate="adblock_title"></h2>
            <p data-translate="adblock_message"></p>
            <button id="adblock-refresh-btn" data-translate="adblock_button"></button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/blockadblock@3.2.1/blockadblock.min.js"></script>
    <script>
        function runAntiAdBlock() {
            if (typeof blockAdBlock === 'undefined') {
                setTimeout(runAntiAdBlock, 200);
                return;
            }
            blockAdBlock.setOption({ checkOnLoad: true, resetOnEnd: true, debug: false });
            blockAdBlock.onDetected(function() {
                const overlay = document.getElementById('adblock-overlay');
                if(overlay) {
                    overlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        runAntiAdBlock();
        const refreshBtn = document.getElementById('adblock-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => window.location.reload());
        }
    </script>

</body>
</html>