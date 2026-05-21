document.addEventListener('DOMContentLoaded', () => {
    // Nav Elements
    const navHome = document.getElementById('nav-home');
    const navLogin = document.getElementById('nav-login');
    const navDashboard = document.getElementById('nav-dashboard');
    const navLogout = document.getElementById('nav-logout');

    // Views
    const views = {
        home: document.getElementById('view-home'),
        auth: document.getElementById('view-auth'),
        upload: document.getElementById('view-upload'),
        dashboard: document.getElementById('view-dashboard')
    };

    // Action Buttons
    const btnGetStarted = document.getElementById('btn-get-started');
    const btnHeroLearn = document.getElementById('btn-hero-learn');

    // Auth Tabs
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // Upload Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const btnBrowse = document.getElementById('btn-browse');
    const uploadStatus = document.getElementById('upload-status');

    let isAuthenticated = false;

    // View Management
    function switchView(viewName) {
        Object.values(views).forEach(view => {
            view.classList.remove('active');
            view.classList.add('hidden');
        });
        views[viewName].classList.remove('hidden');
        setTimeout(() => views[viewName].classList.add('active'), 10);
        window.scrollTo(0, 0);
    }

    function updateNav() {
        if (isAuthenticated) {
            navLogin.classList.add('hidden');
            navDashboard.classList.remove('hidden');
            navLogout.classList.remove('hidden');
        } else {
            navLogin.classList.remove('hidden');
            navDashboard.classList.add('hidden');
            navLogout.classList.add('hidden');
        }
    }

    // Navigation Listeners
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home');
    });

    navLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('auth');
    });

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('upload');
    });

    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        isAuthenticated = false;
        updateNav();
        switchView('home');
    });

    btnGetStarted.addEventListener('click', () => switchView('auth'));
    btnHeroLearn.addEventListener('click', () => switchView('auth'));

    // Auth Tab Listeners
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.add('active');
        formLogin.classList.remove('hidden');
        formRegister.classList.remove('active');
        formRegister.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.classList.add('active');
        formRegister.classList.remove('hidden');
        formLogin.classList.remove('active');
        formLogin.classList.add('hidden');
    });

    // Authenticaton Mock
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        authenticateUser();
    });

    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        authenticateUser();
    });

    function authenticateUser() {
        isAuthenticated = true;
        updateNav();
        switchView('upload');
    }

    // Upload Logic
    btnBrowse.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFile);
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile({ target: { files: e.dataTransfer.files } });
        }
    });

    function handleFile(e) {
        if (!e.target.files.length) return;
        const file = e.target.files[0];
        // Validate
        if (!file.name.match(/\.(pdf|docx)$/i)) {
            alert('Please upload a PDF or DOCX file.');
            return;
        }
        
        // Mock processing
        dropZone.classList.add('hidden');
        uploadStatus.classList.remove('hidden');
        
        setTimeout(() => {
            dropZone.classList.remove('hidden');
            uploadStatus.classList.add('hidden');
            switchView('dashboard');
            startTimers();
        }, 3000); // 3 seconds mock processing
    }

    // Timer Logic for Medication
    function startTimers() {
        const amoxTimer = document.querySelector('#timer-amox .time-left');
        let timeLeft = 4 * 3600 + 30 * 60; // 4h 30m
        
        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        };

        const interval = setInterval(() => {
            if(timeLeft <= 0) {
                clearInterval(interval);
                amoxTimer.innerText = "Take Now!";
                amoxTimer.style.color = "#E57373"; // Red alert
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Medication Reminder", { body: "It's time to take your Amoxicillin." });
                }
                return;
            }
            timeLeft--;
            if (amoxTimer) {
                amoxTimer.innerText = formatTime(timeLeft);
            }
        }, 1000);

        // Action Buttons Handle
        const actionBtns = document.querySelectorAll('.med-action');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.innerText = "Completed";
                this.classList.replace('btn-outline', 'btn-secondary');
                this.style.backgroundColor = "var(--success)";
                this.style.color = "white";
                this.style.borderColor = "var(--success)";
                clearInterval(interval);
                if (amoxTimer) amoxTimer.innerText = "Next dose tomorrow";
            });
        });

        // Request Notification Permission
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }
});
