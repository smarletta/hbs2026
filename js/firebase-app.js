// =====================================================
// HBS2026 Live Scoring System - Firebase App Logic
// =====================================================

// ==================== CONFIGURATION ====================
/**
 * Firebase configuration for the HBS2026 application
 */
const firebaseConfig = {
  apiKey: "AIzaSyDaTFFp4XHAhYesmybpO7P-4n6M4cpGMWY",
  authDomain: "hbs2026-5d23d.firebaseapp.com",
  projectId: "hbs2026-5d23d",
  storageBucket: "hbs2026-5d23d.firebasestorage.app",
  messagingSenderId: "901953520067",
  appId: "1:901953520067:web:4ea76ea4900f9eb4953d76"
};

// ==================== GLOBAL VARIABLES ====================
/**
 * Application state variables
 */
let clubs = [];
let deleteConfirmId = null;
const itemHeight = 72;
let unsubscribeClubs = null;
let db = null;
let auth = null; // Firebase Auth
let googleProvider = null; // Google Auth Provider
let isLoggedIn = false;
let processingClicks = new Set(); // Track which buttons are being processed
let showAllInDashboard = false; // Toggle for dashboard view

// ==================== PERFORMANCE OPTIMIZATION ====================
/**
 * Performance optimization variables for multi-user concurrency
 */
let renderTimeout = null;
let lastRenderedClubs = [];
let isLoading = true; // Loading state for skeleton display

// ==================== UTILITY FUNCTIONS ====================
/**
 * Debounce function for batched rendering to reduce excessive re-renders
 * @param {number} delay - Delay in milliseconds (default: 200ms)
 */
function debounceRender(delay = 200) {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
        render();
    }, delay);
}

// ==================== FIREBASE INITIALIZATION ====================
function initializeFirebase() {
    console.log('Checking Firebase availability...');
    
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded!');
        console.log('Available window objects:', Object.keys(window).filter(key => key.includes('firebase')));
        return false;
    }
    
    try {
        console.log('Initializing Firebase...');
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth(); // Initialize Auth
        
        // Set up Google Auth Provider
        googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showUserError('Firebase konnte nicht geladen werden. Bitte Seite neu laden.');
        return false;
    }
}

// ==================== MODAL FUNCTIONS ====================
/**
 * Shows the login modal with animations
 */
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    const modalContent = document.getElementById('loginModalContent');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Focus email input
    setTimeout(() => {
        document.getElementById('loginEmail').focus();
    }, 300);
    
    // Clear previous errors
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    const modalContent = document.getElementById('loginModalContent');
    
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

/**
 * Shows a user-friendly error message
 * @param {string} message - Error message to display
 */
function showUserError(message) {
    // Use alert for now, could be enhanced to use toast notifications
    alert(`Fehler: ${message}`);
}

function setLoginLoading(loading) {
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = document.getElementById('loginBtnText');
    const btnLoading = document.getElementById('loginBtnLoading');
    
    if (loading) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

/**
 * Shows the login modal and prompts for authentication
 */
async function login() {
    showLoginModal();
}

async function performLogin(email, password) {
    try {
        setLoginLoading(true);
        showLoginError('');
        
        // Sign in with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Login successful:', userCredential.user);
        
        isLoggedIn = true;
        updateLoginUI();
        closeLoginModal();
        
        // Switch to admin tab after successful login
        document.getElementById('admin-tab').classList.remove('hidden');
        document.getElementById('dashboard-tab').classList.add('hidden');
        document.getElementById('btn-admin').className = "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]";
        document.getElementById('btn-dashboard').className = "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
        render();
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = "Login fehlgeschlagen!";
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = "Benutzer nicht gefunden!";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Falsches Passwort!";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Ungültige Email!";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "Zu viele Versuche. Bitte später erneut versuchen.";
        }
        
        showLoginError(errorMessage);
    } finally {
        setLoginLoading(false);
    }
}

// Google Sign-In function
async function signInWithGoogle() {
    try {
        setLoginLoading(true);
        showLoginError('');
        
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        console.log('Google sign-in successful:', user);
        
        isLoggedIn = true;
        updateLoginUI();
        closeLoginModal();
        
        // Switch to admin tab after successful login
        document.getElementById('admin-tab').classList.remove('hidden');
        document.getElementById('dashboard-tab').classList.add('hidden');
        document.getElementById('btn-admin').className = "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]";
        document.getElementById('btn-dashboard').className = "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
        render();
        
    } catch (error) {
        console.error('Google sign-in error:', error);
        let errorMessage = 'Fehler bei Google-Anmeldung!';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Anmeldung wurde abgebrochen.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Popup wurde blockiert. Bitte erlauben Sie Popups.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Anmeldung wurde abgebrochen.';
        }
        
        showLoginError(errorMessage);
    } finally {
        setLoginLoading(false);
    }
}

function logout() {
    auth.signOut().then(() => {
        console.log('Logout successful');
        isLoggedIn = false;
        updateLoginUI();
        switchTab('dashboard'); // Switch to dashboard on logout
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

function updateLoginUI() {
    const adminBtn = document.getElementById('btn-admin');
    const logoutBtn = document.getElementById('btn-logout');
    
    if (isLoggedIn) {
        adminBtn.innerHTML = "ADMIN ✓";
        adminBtn.classList.add("bg-green-600");
        logoutBtn.classList.remove("hidden");
    } else {
        adminBtn.innerHTML = "ADMIN";
        adminBtn.classList.remove("bg-green-600");
        logoutBtn.classList.add("hidden");
    }
}

// ==================== CLUB MANAGEMENT FUNCTIONS ====================
// Global functions that check Firebase availability
async function addClub() {
    if (!isLoggedIn) {
        alert("Bitte zuerst einloggen!");
        login();
        return;
    }
    
    if (!db) {
        console.error('Firebase not initialized');
        alert('Firebase nicht verfügbar. Bitte Seite neu laden.');
        return;
    }
    
    const input = document.getElementById('clubName');
    if (!input.value.trim()) return;
    
    const newClub = {
        name: input.value.trim().toUpperCase(),
        points: 0
    };
    
    await saveClub(newClub);
    input.value = '';
}

async function addPoints(id, pts) {
    console.log('addPoints called:', { id, pts, isLoggedIn, dbAvailable: !!db });
    
    if (!isLoggedIn) {
        console.log('Not logged in, prompting login...');
        alert("Bitte zuerst einloggen!");
        login();
        return;
    }
    
    if (!db) {
        console.error('Firebase not initialized');
        alert('Firebase nicht verfügbar. Bitte Seite neu laden.');
        return;
    }
    
    // Prevent multiple clicks on the same button
    const clickKey = `${id}-${pts}`;
    if (processingClicks.has(clickKey)) {
        console.log('Click already being processed:', clickKey);
        return;
    }
    
    console.log('Processing click:', clickKey);
    processingClicks.add(clickKey);
    
    // Add visual feedback - disable the button
    const button = document.querySelector(`button[onclick="addPoints('${id}', ${pts})"]`);
    if (button) {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    try {
        const club = clubs.find(x => x.id === id);
        if (club) {
            club.points += pts;
            await saveClub(club);
            console.log('Points added successfully:', club);
        }
    } finally {
        // Remove from processing set after a short delay
        setTimeout(() => {
            processingClicks.delete(clickKey);
            console.log('Click processing completed:', clickKey);
            
            // Re-enable the button
            if (button) {
                button.disabled = false;
                button.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }, 500);
    }
}

async function renameClub(id) {
    if (!isLoggedIn) {
        alert("Bitte zuerst einloggen!");
        login();
        return;
    }
    
    if (!db) {
        console.error('Firebase not initialized');
        alert('Firebase nicht verfügbar. Bitte Seite neu laden.');
        return;
    }
    
    const club = clubs.find(x => x.id === id);
    const newName = prompt("Vereinsname ändern:", club.name);
    if (newName !== null && newName.trim() !== "") {
        club.name = newName.trim().toUpperCase();
        await saveClub(club);
    }
}

async function confirmDelete(id) {
    if (!isLoggedIn) {
        alert("Bitte zuerst einloggen!");
        login();
        return;
    }
    
    if (!db) {
        console.error('Firebase not initialized');
        alert('Firebase nicht verfügbar. Bitte Seite neu laden.');
        return;
    }
    
    if (deleteConfirmId === id) {
        await deleteClub(id);
        deleteConfirmId = null;
    } else {
        deleteConfirmId = id;
        render();
        // Reset after 3 seconds if not confirmed
        setTimeout(() => { 
            if(deleteConfirmId === id) { 
                deleteConfirmId = null; 
                render(); 
            } 
        }, 3000);
    }
}

function switchTab(tab) {
    const isAdmin = tab === 'admin';
    
    // Check login for admin tab
    if (isAdmin && !isLoggedIn) {
        login();
        return;
    }
    
    document.getElementById('admin-tab').classList.toggle('hidden', !isAdmin);
    document.getElementById('dashboard-tab').classList.toggle('hidden', isAdmin);
    document.getElementById('btn-admin').className = isAdmin ? 
        "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]" : 
        "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
    document.getElementById('btn-dashboard').className = !isAdmin ? 
        "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]" : 
        "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
    
    // Hide/show countdown, header-info and footer in admin view
    const countdownSection = document.querySelector('.countdown-section');
    const headerInfo = document.querySelector('.header-info');
    const footer = document.querySelector('footer');
    
    if (countdownSection) {
        countdownSection.style.display = isAdmin ? 'none' : 'block';
    }
    if (headerInfo) {
        headerInfo.style.display = isAdmin ? 'none' : 'block';
    }
    if (footer) {
        footer.style.display = isAdmin ? 'none' : 'block';
    }
    
    // Show admin tab if logged in
    if (isAdmin && isLoggedIn) {
        document.getElementById('admin-tab').classList.remove('hidden');
        document.getElementById('dashboard-tab').classList.add('hidden');
    }
    
    // Show/hide dashboard controls based on login status
    const dashboardControls = document.getElementById('dashboard-controls');
    if (!isAdmin && isLoggedIn) {
        dashboardControls.classList.remove('hidden');
    } else {
        dashboardControls.classList.add('hidden');
    }
    
    render();
}

function toggleDashboardView() {
    showAllInDashboard = !showAllInDashboard;
    const toggleBtn = document.getElementById('btn-toggle-view');
    toggleBtn.textContent = showAllInDashboard ? 'TOP 10 ANZEIGEN' : 'ALLE ANZEIGEN';
    render();
}

// ==================== UI RENDERING FUNCTIONS ====================
async function loadClubs() {
    try {
        isLoading = true;
        debounceRender();
        
        const snapshot = await db.collection('clubs').orderBy('points', 'desc').get();
        clubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        isLoading = false;
        debounceRender();
    } catch (error) {
        console.error('Error loading clubs:', error);
        // Fallback to localStorage if Firebase fails
        clubs = JSON.parse(localStorage.getItem('hexen_clubs')) || [];
        isLoading = false;
        debounceRender();
    }
}

async function saveClub(club) {
    try {
        if (club.id && typeof club.id === 'string') {
            // Update existing club
            await db.collection('clubs').doc(club.id).update({
                name: club.name,
                points: club.points
            });
        } else {
            // Add new club
            const docRef = await db.collection('clubs').add({
                name: club.name,
                points: club.points
            });
            club.id = docRef.id;
        }
    } catch (error) {
        console.error('Error saving club:', error);
        // Fallback to localStorage
        localStorage.setItem('hexen_clubs', JSON.stringify(clubs));
    }
}

async function deleteClub(clubId) {
    try {
        await db.collection('clubs').doc(clubId).delete();
    } catch (error) {
        console.error('Error deleting club:', error);
        // Fallback to localStorage
        clubs = clubs.filter(x => x.id !== clubId);
        localStorage.setItem('hexen_clubs', JSON.stringify(clubs));
    }
}

// ==================== FIREBASE FUNCTIONS ====================
function setupRealtimeListener() {
    unsubscribeClubs = db.collection('clubs').orderBy('points', 'desc')
        .onSnapshot((snapshot) => {
            const newClubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Check if data actually changed before triggering render
            const hasChanged = JSON.stringify(newClubs) !== JSON.stringify(clubs);
            
            if (hasChanged) {
                clubs = newClubs;
                // Use debounced rendering for performance
                debounceRender();
            }
        }, (error) => {
            console.error('Real-time listener error:', error);
            // Fallback to polling localStorage
            setInterval(() => {
                const data = JSON.parse(localStorage.getItem('hexen_clubs')) || [];
                if (JSON.stringify(data) !== JSON.stringify(clubs)) { 
                    clubs = data; 
                    debounceRender(); 
                }
            }, 800);
        });
}

// Render function (used by both Firebase and global functions)
function render() {
    // Skip if no clubs loaded
    if (!clubs || clubs.length === 0) return;
    
    // Check if data has actually changed
    const currentClubsStr = JSON.stringify(clubs);
    if (currentClubsStr === JSON.stringify(lastRenderedClubs)) {
        return; // No changes, skip render
    }
    lastRenderedClubs = [...clubs];
    
    const adminList = document.getElementById('admin-list');
    const rankingList = document.getElementById('ranking-list');

    // Admin Rendering - show all clubs for admin
    adminList.innerHTML = clubs.map(c => `
        <div class="glass-card p-4 rounded-2xl flex flex-col gap-3 border-l-4 border-[#3f755f]">
            <div class="flex justify-between items-center px-1">
                <span class="font-bold truncate text-[#2c3330] uppercase text-sm flex-1">${c.name}</span>
                <div class="flex gap-2">
                     <button onclick="renameClub('${c.id}')" class="text-gray-400 hover:text-[#3f755f]">✎</button>
                     <button onclick="confirmDelete('${c.id}')" class="text-xs px-2 py-1 rounded transition-colors ${deleteConfirmId === c.id ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:text-red-500'}">
                        ${deleteConfirmId === c.id ? 'SICHER?' : '✕'}
                     </button>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="addPoints('${c.id}', 1)" class="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-sm hover:bg-gray-200">+1</button>
                <button onclick="addPoints('${c.id}', 3)" class="flex-1 bg-[#e4c342]/20 border border-[#e4c342] py-3 rounded-xl font-bold text-sm hover:bg-[#e4c342]/40">+3</button>
            </div>
        </div>
    `).join('');

    // Dashboard Rendering - show top 10 or all based on toggle
    const sorted = [...clubs].sort((a, b) => b.points - a.points);
    const displayClubs = (isLoggedIn && showAllInDashboard) ? sorted : sorted.slice(0, 10);
    rankingList.style.height = `${displayClubs.length * itemHeight}px`;

    if (isLoading && displayClubs.length === 0) {
        // Show skeleton loaders
        rankingList.innerHTML = Array(10).fill().map((_, index) => `
            <div class="ranking-item fade-in" style="transform: translateY(${index * itemHeight}px)">
                <div class="skeleton-card">
                    <div class="rank skeleton"></div>
                    <div class="name skeleton"></div>
                    <div class="points skeleton"></div>
                </div>
            </div>
        `).join('');
    } else {
        // Show real cards with slide-up animation
        displayClubs.forEach((c, index) => {
            let el = rankingList.querySelector(`[data-id="${c.id}"]`);
            const isNew = !el;
            if (isNew) {
                el = document.createElement('div');
                el.dataset.id = c.id;
                el.dataset.points = c.points;
                el.className = 'ranking-item slide-up';
                rankingList.appendChild(el);
            }
            const pointsChanged = !isNew && parseInt(el.dataset.points) !== c.points;
            el.dataset.points = c.points;
            el.style.transform = `translateY(${index * itemHeight}px)`;
            el.innerHTML = `
                <div class="rank-box flex items-center rounded-2xl px-6 relative overflow-hidden transition-all duration-300">
                    <div class="w-10 text-3xl font-black ${index < 3 ? 'gold-text' : 'text-white/20'} italic">${index + 1}</div>
                    <div class="flex-1 text-white font-bold text-xl uppercase tracking-tight truncate ml-4">${c.name}</div>
                    <div class="text-4xl font-black gold-text ${pointsChanged ? 'animate-pop' : ''}">${c.points}</div>
                </div>
            `;
        });

        // Remove elements that are no longer in display
        Array.from(rankingList.children).forEach(child => {
            if (!displayClubs.find(c => c.id === child.dataset.id)) child.remove();
        });
    }
}

// ==================== COUNTDOWN FUNCTIONS ====================
function updateCountdown() {
    const now = new Date();
    const saturday = new Date();
    saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7) || 7);
    saturday.setHours(0, 0, 0, 0);
    
    const diff = saturday - now;
    
    if (diff <= 0) {
        saturday.setDate(saturday.getDate() + 7);
    }
    
    const updatedDiff = saturday - now;
    const totalHours = Math.floor(updatedDiff / (1000 * 60 * 60));
    const hours = totalHours; // Show total hours, not modulo 24
    const minutes = Math.floor((updatedDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((updatedDiff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}

// ==================== INITIALIZATION ====================
// Register service worker for PWA (independent of DOM ready)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/hbs2026/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');
    
    // Initialize login UI
    updateLoginUI();
    
    // Set up login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await performLogin(email, password);
    });
    
    // Initialize Firebase first
    const firebaseReady = initializeFirebase();
    
    if (firebaseReady) {
        // Set up auth state listener for persistent sessions
        auth.onAuthStateChanged((user) => {
            console.log('Auth state changed:', user);
            if (user) {
                // User is signed in
                isLoggedIn = true;
                updateLoginUI();
                console.log('User already logged in:', user.email);
            } else {
                // User is signed out
                isLoggedIn = false;
                updateLoginUI();
                console.log('User is logged out');
            }
        });
        
        // Load initial data and setup real-time listener
        await loadClubs();
        setupRealtimeListener();
        console.log('Firebase real-time listener setup complete');
    } else {
        console.error('Failed to initialize Firebase - application will not work');
        alert('Firebase konnte nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung.');
        return;
    }
    
    // Start countdown
    setInterval(updateCountdown, 1000);
    updateCountdown();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (unsubscribeClubs) {
        unsubscribeClubs();
    }
});
