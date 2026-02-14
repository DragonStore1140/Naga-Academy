// Global Variables
let bookmarkedQuestions = []; // Array untuk menyimpan soal yang ditandai ragu-ragu

let currentUser = {
    name: "",
    class: "",
    isLoggedIn: false
};

let settings = {
    theme: 'light',
    fontSize: 'normal'
};

let currentExam = {
    type: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    timer: null,
    timeLeft: 3000
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadProfilePictureForAllPages(); // Panggil fungsi load profile picture
    
    // Cek apakah ini halaman index (ada login modal)
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname === '/' || 
                        window.location.pathname.endsWith('/');
    
    // Cek apakah sudah login
    const savedUser = localStorage.getItem('academyNagaUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.isLoggedIn && currentUser.name && currentUser.class) {
            // Login sukses - update info di semua halaman
            updateUserInfo();
            
            // Hanya di index.html, sembunyikan login modal
            if (isIndexPage) {
                hideElement('loginModal');
                showElement('mainHeader');
                showElement('mainContent');
            }
        } else {
            // Data tidak lengkap
            if (isIndexPage) {
                showLoginModal();
            } else {
                window.location.href = 'index.html';
            }
        }
    } else {
        // Belum pernah login
        if (isIndexPage) {
            showLoginModal();
        } else {
            window.location.href = 'index.html';
        }
    }
    
    // Cek halaman
    if (window.location.pathname.includes('soal')) {
        // Validasi sebelum masuk soal
        if (!validateAccess()) return;
        startExam(window.location.pathname.includes('bindo') ? 'bindo' : 'mtk');
    }
    
    if (window.location.pathname.includes('rangkuman')) {
        // Validasi sebelum masuk rangkuman
        if (!validateAccess()) return;
        showMateriList(window.location.pathname.includes('bindo') ? 'bindo' : 'mtk');
    }
});

// Helper functions untuk amanin element
function getElement(id) {
    return document.getElementById(id);
}

function hideElement(id) {
    const el = getElement(id);
    if (el) el.style.display = 'none';
}

function showElement(id, displayType = 'block') {
    const el = getElement(id);
    if (el) el.style.display = displayType;
}

// Show login modal - HANYA di index.html
function showLoginModal() {
    hideElement('mainHeader');
    hideElement('mainContent');
    showElement('loginModal', 'flex');
}

// Handle login
function handleLogin() {
    const nameInput = getElement('loginName');
    const classInput = getElement('loginClass');
    const passwordInput = getElement('loginPassword');
    const errorDiv = getElement('loginError');
    
    if (!nameInput || !classInput || !passwordInput || !errorDiv) {
        console.error('Element login tidak ditemukan');
        return;
    }
    
    const name = nameInput.value.trim();
    const kelas = classInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Reset error
    errorDiv.style.display = 'none';
    
    // Validasi
    if (!name || !kelas || !password) {
        showLoginError('Semua data harus diisi!');
        return;
    }
    
    if (password !== 'try2026') {
        showLoginError('Password salah! Beli password seharga Rp5.000 di wa 08978115643');
        return;
    }
    
    // Login sukses - AUTO SAVE
    currentUser = {
        name: name,
        class: kelas,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
    };
    
    // Simpan ke localStorage
    localStorage.setItem('academyNagaUser', JSON.stringify(currentUser));
    
    // Tampilkan konten
    hideElement('loginModal');
    showElement('mainHeader', 'flex');
    showElement('mainContent', 'block');
    
    // Update header
    updateUserInfo();
    
    // Load profile picture
    loadProfilePictureForAllPages();
    
    // Bersihkan form login
    passwordInput.value = '';
}

function showLoginError(message) {
    const errorDiv = getElement('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Validate access untuk halaman lain
function validateAccess() {
    const savedUser = localStorage.getItem('academyNagaUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    const user = JSON.parse(savedUser);
    if (!user.isLoggedIn || !user.name || !user.class) {
        window.location.href = 'index.html';
        return false;
    }
    
    currentUser = user;
    return true;
}

// Check access sebelum pindah halaman
function checkAccess(page) {
    const savedUser = localStorage.getItem('academyNagaUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(savedUser);
    if (!user.isLoggedIn || !user.name || !user.class) {
        window.location.href = 'index.html';
        return;
    }
    
    window.location.href = page;
}

// User Functions
function loadUser() {
    const saved = localStorage.getItem('academyNagaUser');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

// AUTO SAVE - setiap kali ada perubahan
function autoSaveUser() {
    localStorage.setItem('academyNagaUser', JSON.stringify(currentUser));
    updateUserInfo();
}

function updateUserInfo() {
    // Update header - pakai ID
    const headerName = getElement('headerName');
    const headerClass = getElement('headerClass');
    
    if (headerName) headerName.textContent = currentUser.name || '-';
    if (headerClass) headerClass.textContent = currentUser.class || '-';
    
    // Update settings display
    const settingsName = getElement('settingsNameDisplay');
    const settingsClass = getElement('settingsClassDisplay');
    
    if (settingsName) settingsName.textContent = currentUser.name || '-';
    if (settingsClass) settingsClass.textContent = currentUser.class || '-';
    
    // Update semua elemen dengan class (fallback)
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = currentUser.name;
    });
    document.querySelectorAll('.user-class').forEach(el => {
        el.textContent = currentUser.class;
    });
}

// Settings
function openSettings() {
    if (!currentUser.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'block';
    
    // Isi input dengan data current user
    const editName = document.getElementById('editName');
    const editClass = document.getElementById('editClass');
    
    if (editName) editName.value = currentUser.name || '';
    if (editClass) editClass.value = currentUser.class || '';
    
    // Set theme & font size
    const themeSelect = document.getElementById('theme');
    const fontSizeSelect = document.getElementById('fontSize');
    
    if (themeSelect) themeSelect.value = settings.theme;
    if (fontSizeSelect) fontSizeSelect.value = settings.fontSize;
    
    // Update display
    const settingsName = getElement('settingsNameDisplay');
    const settingsClass = getElement('settingsClassDisplay');
    
    if (settingsName) settingsName.textContent = currentUser.name;
    if (settingsClass) settingsClass.textContent = currentUser.class;
}

function closeSettings() {
    const modal = getElement('settingsModal');
    if (modal) modal.style.display = 'none';
}

function changeTheme(theme) {
    document.body.className = theme;
    settings.theme = theme;
    localStorage.setItem('academyNagaSettings', JSON.stringify(settings));
}

function changeFontSize(size) {
    document.body.classList.remove('normal', 'large', 'larger');
    document.body.classList.add(size);
    settings.fontSize = size;
    localStorage.setItem('academyNagaSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('academyNagaSettings');
    if (saved) {
        settings = JSON.parse(saved);
        document.body.className = settings.theme;
        document.body.classList.add(settings.fontSize);
    }
}

// Fungsi untuk save profile changes
function saveProfileChanges() {
    const newName = document.getElementById('editName').value.trim();
    const newClass = document.getElementById('editClass').value.trim();
    
    if (!newName || !newClass) {
        alert('Nama dan kelas tidak boleh kosong!');
        return;
    }
    
    // Update currentUser
    currentUser.name = newName;
    currentUser.class = newClass;
    
    // Save ke localStorage
    localStorage.setItem('academyNagaUser', JSON.stringify(currentUser));
    
    // Update tampilan
    updateUserInfo();
    
    // Kasih notifikasi
    alert('Data diri berhasil diperbarui!');
    
    // Tutup modal
    closeSettings();
}

// ========== FUNGSI UPLOAD PROFILE PICTURE ==========
let selectedProfileImage = null;

// Preview gambar sebelum diupload
function previewProfileImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Tampilkan preview
            const preview = document.getElementById('profilePreview');
            if (preview) {
                preview.src = e.target.result;
            }
            
            // Simpan sementara
            selectedProfileImage = e.target.result;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Simpan profile picture ke localStorage
function saveProfilePicture() {
    if (!selectedProfileImage) {
        alert('Pilih gambar dulu bang!');
        return;
    }
    
    // Simpan ke localStorage
    localStorage.setItem('userProfileImage', selectedProfileImage);
    
    // Update header di SEMUA halaman (pake fungsi yang sama)
    loadProfilePictureForAllPages();
    
    alert('Foto profil berhasil disimpan!');
    
    // Reset input file
    document.getElementById('profileUpload').value = '';
}

// Load profile picture saat login
function loadProfilePicture() {
    const savedImage = localStorage.getItem('userProfileImage');
    const headerImg = document.getElementById('headerProfileImg');
    
    if (savedImage && headerImg) {
        headerImg.src = savedImage;
    }
}

// Fungsi untuk load profile picture di SEMUA halaman
function loadProfilePictureForAllPages() {
    const savedImage = localStorage.getItem('userProfileImage');
    const headerImg = document.getElementById('headerProfileImg');
    
    if (savedImage && headerImg) {
        headerImg.src = savedImage;
    } else if (headerImg) {
        // Kalau ga ada, pake default
        headerImg.src = 'gambar/profile.png';
    }
}

// Reset profile picture ke default
function resetProfilePicture() {
    // Hapus dari localStorage
    localStorage.removeItem('userProfileImage');
    
    // Reset header
    const headerImg = document.getElementById('headerProfileImg');
    if (headerImg) {
        headerImg.src = 'gambar/profile.png';
    }
    
    // Reset preview di modal
    const preview = document.getElementById('profilePreview');
    if (preview) {
        preview.src = 'gambar/profile.png';
    }
    
    alert('Foto profil kembali ke default!');
}

// Exam Functions
function startExam(mataPelajaran) {
    // Validasi login dulu
    if (!validateAccess()) return;
    
    // Ambil parameter sesi dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const sesi = parseInt(urlParams.get('sesi')) || 1;
    
    currentExam.type = mataPelajaran;
    currentExam.currentIndex = 0;
    currentExam.answers = [];
    currentExam.timeLeft = 3000;
    
    const allQuestions = mataPelajaran === 'bindo' ? soalBindo : soalMtk;
    if (!allQuestions) {
        console.error('Database soal tidak ditemukan!');
        return;
    }
    
    // Tentukan range soal berdasarkan sesi (25 soal per sesi)
    let startId, endId;
    
    if (sesi === 1) {
        startId = 1;
        endId = 25;
    } else if (sesi === 2) {
        startId = 26;
        endId = 50;
    } else if (sesi === 3) {
        startId = 51;
        endId = 75;
    } else if (sesi === 4) {
        startId = 76;
        endId = 100;
    } else {
        // Default ke sesi 1
        startId = 1;
        endId = 25;
    }
    
    // Filter soal berdasarkan range id (URUT, TIDAK DIACAK)
    const availableQuestions = allQuestions.filter(q => q.id >= startId && q.id <= endId);
    
    // Validasi: cek apakah ada soal untuk sesi ini
    if (availableQuestions.length === 0) {
        alert(`Sesi ${sesi} (soal ${startId}-${endId}) belum tersedia. Silakan pilih sesi lain.`);
        window.location.href = 'index.html';
        return;
    }
    
    // Kasih tahu user kalau soalnya kurang dari 25 (misal baru sampai 40)
    if (availableQuestions.length < 25) {
        alert(`Sesi ${sesi} hanya tersedia ${availableQuestions.length} soal. Soal akan ditampilkan seadanya.`);
    }
    
    // LANGSUNG PAKAI, TANPA DIACAK (soal berurutan sesuai id)
    currentExam.questions = availableQuestions;
    
    // Reset bookmark
    bookmarkedQuestions = [];
    
    currentExam.questions.forEach((q, i) => {
        currentExam.answers[i] = {
            type: q.type,
            answers: q.type === 'pg_kompleks' ? [] : (q.type === 'benar_salah' ? [] : null)
        };
    });
    
    startTimer();
    showQuestion();
    renderQuestionNavigator(); // Render navigator
}

// Fungsi shuffleArray masih dipake di tempat lain? 
// Kalau udah gak dipake, bisa dihapus atau dibiarin aja
function shuffleArray(array) {
    if (!array) return [];
    return [...array].sort(() => Math.random() - 0.5);
}

function startTimer() {
    if (currentExam.timer) clearInterval(currentExam.timer);
    
    currentExam.timer = setInterval(() => {
        currentExam.timeLeft--;
        
        const timer = getElement('timer');
        if (timer) {
            const minutes = Math.floor(currentExam.timeLeft / 60);
            const seconds = currentExam.timeLeft % 60;
            timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (currentExam.timeLeft <= 60) {
                timer.className = 'timer danger';
            } else if (currentExam.timeLeft <= 300) {
                timer.className = 'timer warning';
            }
        }
        
        if (currentExam.timeLeft <= 0) {
            clearInterval(currentExam.timer);
            submitExam();
        }
    }, 1000);
}

function showQuestion() {
    const q = currentExam.questions[currentExam.currentIndex];
    const container = getElement('soalContainer');
    if (!container) return;
    
    const currentQEl = getElement('currentQuestion');
    const totalQEl = getElement('totalQuestions');
    
    if (currentQEl) currentQEl.textContent = currentExam.currentIndex + 1;
    if (totalQEl) totalQEl.textContent = currentExam.questions.length;
    
    // Cek status bookmark
    const isBookmarked = bookmarkedQuestions.includes(currentExam.currentIndex);
    
    let html = `
        <div class="soal-card">
            <div class="soal-header-with-bookmark">
                <div class="soal-nomor">Soal ${currentExam.currentIndex + 1}</div>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark()">
                    <span class="bookmark-icon">${isBookmarked ? '⭐' : '☆'}</span>
                    ${isBookmarked ? 'Hapus Ragu' : 'Tandai Ragu'}
                </button>
            </div>
            <div class="soal-text">${q.soal}</div>
    `;
    
    if (q.gambar) {
        html += `<img src="gambar/soal/${q.gambar}" class="soal-gambar" onerror="this.style.display='none'">`;
    }
    
    if (q.type === 'pg') html += showPG(q);
    else if (q.type === 'pg_kompleks') html += showPGKompleks(q);
    else if (q.type === 'benar_salah') html += showBenarSalah(q);
    
    html += '</div>';
    
    html += `
        <div class="soal-navigation">
            <button class="nav-btn" onclick="prevQuestion()" ${currentExam.currentIndex === 0 ? 'disabled' : ''}>Sebelumnya</button>
            ${currentExam.currentIndex === currentExam.questions.length - 1 
                ? '<button class="submit-btn" onclick="submitExam()">Kirim</button>' 
                : '<button class="nav-btn" onclick="nextQuestion()">Selanjutnya</button>'}
        </div>
    `;
    
    container.innerHTML = html;
    loadSavedAnswers();
    renderQuestionNavigator(); // Panggil navigator
}

function showPG(q) {
    let options = [q.jawaban_benar, ...q.jawaban_salah];
    options = shuffleArray(options);
    
    let html = '<div class="pilihan-container">';
    options.forEach((opt, i) => {
        const id = `q${currentExam.currentIndex}_${i}`;
        html += `
            <div class="pilihan-item" onclick="selectPG('${id}')">
                <input type="radio" name="q${currentExam.currentIndex}" id="${id}" value="${opt}">
                <span>${opt}</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function showPGKompleks(q) {
    let options = [...q.jawaban_benar, ...q.jawaban_salah];
    options = shuffleArray(options);
    
    let html = '<div class="pilihan-container">';
    options.forEach((opt, i) => {
        const id = `q${currentExam.currentIndex}_k${i}`;
        html += `
            <div class="pg-kompleks-item" onclick="togglePGKompleks('${id}')">
                <input type="checkbox" name="q${currentExam.currentIndex}" id="${id}" value="${opt}">
                <span>${opt}</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function showBenarSalah(q) {
    let html = '<div class="pernyataan-container">';
    q.pernyataan.forEach((p, i) => {
        html += `
            <div class="pernyataan-item">
                <div class="pernyataan-text">${p.teks}</div>
                <div class="pernyataan-options">
                    <label onclick="selectBS(${i}, true)">
                        <input type="radio" name="q${currentExam.currentIndex}_p${i}" value="benar">
                        <span>Benar</span>
                    </label>
                    <label onclick="selectBS(${i}, false)">
                        <input type="radio" name="q${currentExam.currentIndex}_p${i}" value="salah">
                        <span>Salah</span>
                    </label>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function selectPG(id) {
    const el = getElement(id);
    if (!el) return;
    
    el.checked = true;
    document.querySelectorAll('.pilihan-item').forEach(item => {
        item.classList.remove('selected');
    });
    el.closest('.pilihan-item').classList.add('selected');
    saveAnswer(el.value);
}

function togglePGKompleks(id) {
    const cb = getElement(id);
    if (!cb) return;
    
    cb.checked = !cb.checked;
    const item = cb.closest('.pg-kompleks-item');
    
    if (cb.checked) {
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
    
    saveKompleksAnswer(cb.value, cb.checked);
}

function selectBS(index, value) {
    const name = `q${currentExam.currentIndex}_p${index}`;
    const radios = document.getElementsByName(name);
    
    radios.forEach(r => {
        if ((value && r.value === 'benar') || (!value && r.value === 'salah')) {
            r.checked = true;
        }
    });
    
    document.querySelectorAll(`[name="${name}"]`).forEach(r => {
        r.closest('label').classList.remove('selected');
    });
    
    event.target.closest('label').classList.add('selected');
    saveBenarSalahAnswer(index, value);
}

function saveAnswer(answer) {
    currentExam.answers[currentExam.currentIndex] = {
        type: 'pg',
        answers: [answer]
    };
    renderQuestionNavigator(); // Tambahkan ini
}

function saveKompleksAnswer(answer, checked) {
    const current = currentExam.answers[currentExam.currentIndex];
    
    if (!current.answers) {
        current.answers = [];
    }
    
    if (checked) {
        if (!current.answers.includes(answer)) {
            current.answers.push(answer);
        }
    } else {
        current.answers = current.answers.filter(a => a !== answer);
    }
    renderQuestionNavigator(); // Tambahkan ini
}

function saveBenarSalahAnswer(index, value) {
    const current = currentExam.answers[currentExam.currentIndex];
    
    if (!current.answers) {
        current.answers = [];
    }
    
    current.answers[index] = value;
    renderQuestionNavigator(); // Tambahkan ini
}

function loadSavedAnswers() {
    const saved = currentExam.answers[currentExam.currentIndex];
    if (!saved || !saved.answers) {
        renderQuestionNavigator(); // Tambahkan ini
        return;
    }
    
    if (saved.type === 'pg' && saved.answers[0]) {
        const radios = document.querySelectorAll(`input[name="q${currentExam.currentIndex}"]`);
        radios.forEach(r => {
            if (r.value === saved.answers[0]) {
                r.checked = true;
                r.closest('.pilihan-item').classList.add('selected');
            }
        });
    } else if (saved.type === 'pg_kompleks' && saved.answers.length > 0) {
        const cbs = document.querySelectorAll(`input[name="q${currentExam.currentIndex}"]`);
        cbs.forEach(cb => {
            if (saved.answers.includes(cb.value)) {
                cb.checked = true;
                cb.closest('.pg-kompleks-item').classList.add('selected');
            }
        });
    } else if (saved.type === 'benar_salah' && saved.answers.length > 0) {
        saved.answers.forEach((val, i) => {
            if (val !== undefined) {
                const radios = document.querySelectorAll(`input[name="q${currentExam.currentIndex}_p${i}"]`);
                radios.forEach(r => {
                    if ((val && r.value === 'benar') || (!val && r.value === 'salah')) {
                        r.checked = true;
                        r.closest('label').classList.add('selected');
                    }
                });
            }
        });
    }
    
    renderQuestionNavigator(); // Tambahkan ini
}

function nextQuestion() {
    if (currentExam.currentIndex < currentExam.questions.length - 1) {
        currentExam.currentIndex++;
        showQuestion();
        renderQuestionNavigator(); // Tambahkan ini
    }
}

function prevQuestion() {
    if (currentExam.currentIndex > 0) {
        currentExam.currentIndex--;
        showQuestion();
        renderQuestionNavigator(); // Tambahkan ini
    }
}

function submitExam() {
    clearInterval(currentExam.timer);
    
    let correct = 0, incorrect = 0, empty = 0;
    
    currentExam.questions.forEach((q, i) => {
        const ans = currentExam.answers[i];
        
        if (!ans || !ans.answers || ans.answers.length === 0) {
            empty++;
            return;
        }
        
        if (q.type === 'pg') {
            if (ans.answers[0] === q.jawaban_benar) correct++;
            else incorrect++;
        } else if (q.type === 'pg_kompleks') {
            const allCorrect = q.jawaban_benar.every(a => ans.answers.includes(a));
            const noExtra = ans.answers.every(a => q.jawaban_benar.includes(a));
            if (allCorrect && noExtra && ans.answers.length === q.jawaban_benar.length) correct++;
            else incorrect++;
        } else if (q.type === 'benar_salah') {
            const allCorrect = q.pernyataan.every((p, idx) => p.benar === ans.answers[idx]);
            if (allCorrect) correct++;
            else incorrect++;
        }
    });
    
    showResult(correct, incorrect, empty);
}

function showResult(correct, incorrect, empty) {
    const total = correct + incorrect + empty;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;
    
    const modal = getElement('resultModal');
    const content = getElement('resultContent');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <h3>Skor: ${percentage}%</h3>
        <div class="result-stats">
            <div class="stat-box correct">
                <div class="stat-number">${correct}</div>
                <div>Benar</div>
            </div>
            <div class="stat-box incorrect">
                <div class="stat-number">${incorrect}</div>
                <div>Salah</div>
            </div>
            <div class="stat-box empty">
                <div class="stat-number">${empty}</div>
                <div>Kosong</div>
            </div>
        </div>
        <p>Total Soal: ${total}</p>
        <p>Waktu: ${Math.floor((3000 - currentExam.timeLeft) / 60)} menit ${(1800 - currentExam.timeLeft) % 60} detik</p>
    `;
    
    modal.style.display = 'block';
}

function closeResultModal() {
    const modal = getElement('resultModal');
    if (modal) modal.style.display = 'none';
}

function backToLobby() {
    window.location.href = 'index.html';
}

// Rangkuman Functions
function showMateriList(mataPelajaran) {
    if (!validateAccess()) return;
    
    const container = getElement('materiContainer');
    if (!container) {
        console.error('Container materi tidak ditemukan!');
        return;
    }
    
    const materi = mataPelajaran === 'bindo' ? rangkumanBindo : rangkumanMtk;
    
    if (!materi || materi.length === 0) {
        container.innerHTML = '<p style="color:red; text-align:center;">Error: Data materi tidak ditemukan</p>';
        return;
    }
    
    let html = '<div class="materi-list">';
    materi.forEach((item, i) => {
        html += `
            <div class="materi-item" onclick="showMateri(${i}, '${mataPelajaran}')">
                <h3>${item.judul}</h3>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function showMateri(index, mataPelajaran) {
    if (!validateAccess()) return;
    
    const materi = mataPelajaran === 'bindo' ? rangkumanBindo : rangkumanMtk;
    if (!materi || !materi[index]) return;
    
    const item = materi[index];
    
    const container = getElement('materiContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button class="back-btn" onclick="showMateriList('${mataPelajaran}')">← Kembali</button>
        <div class="materi-detail">
            <h2>${item.judul}</h2>
            ${item.konten}
        </div>
    `;
}

// ========== FITUR NAVIGASI SOAL & BOOKMARK ==========

// Render navigasi soal
function renderQuestionNavigator() {
    const container = document.getElementById('questionNavigator');
    if (!container) return;
    
    let html = '<div class="navigator-grid">';
    
    for (let i = 0; i < currentExam.questions.length; i++) {
        const questionNumber = i + 1;
        const answer = currentExam.answers[i];
        
        // Tentukan status warna
        let statusClass = 'unanswered';
        
        // Cek apakah di-bookmark
        if (bookmarkedQuestions.includes(i)) {
            statusClass = 'bookmarked';
        }
        // Cek status jawaban
        else if (answer && answer.answers) {
            if (currentExam.questions[i].type === 'benar_salah') {
                // Untuk soal benar/salah, cek partial answer
                const totalPernyataan = currentExam.questions[i].pernyataan.length;
                const answeredCount = answer.answers.filter(a => a !== undefined && a !== null).length;
                
                if (answeredCount === 0) {
                    statusClass = 'unanswered';
                } else if (answeredCount < totalPernyataan) {
                    statusClass = 'partial';
                } else {
                    statusClass = 'answered';
                }
            } else {
                // Untuk PG dan PG Kompleks
                if (answer.answers.length > 0) {
                    statusClass = 'answered';
                }
            }
        }
        
        html += `
            <div class="navigator-item ${statusClass}" onclick="jumpToQuestion(${i})">
                ${questionNumber}
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Lompat ke soal tertentu
function jumpToQuestion(index) {
    if (index >= 0 && index < currentExam.questions.length) {
        currentExam.currentIndex = index;
        showQuestion();
        renderQuestionNavigator();
    }
}

// Toggle bookmark/ragu-ragu
function toggleBookmark() {
    const currentIndex = currentExam.currentIndex;
    
    if (bookmarkedQuestions.includes(currentIndex)) {
        // Hapus dari bookmark
        bookmarkedQuestions = bookmarkedQuestions.filter(i => i !== currentIndex);
    } else {
        // Tambah ke bookmark
        bookmarkedQuestions.push(currentIndex);
    }
    
    // Update tampilan
    showQuestion(); // Refresh untuk update tombol
    renderQuestionNavigator(); // Update navigator
}