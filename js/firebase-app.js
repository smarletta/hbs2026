// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaTFFp4XHAhYesmybpO7P-4n6M4cpGMWY",
  authDomain: "hbs2026-5d23d.firebaseapp.com",
  projectId: "hbs2026-5d23d",
  storageBucket: "hbs2026-5d23d.firebasestorage.app",
  messagingSenderId: "901953520067",
  appId: "1:901953520067:web:4ea76ea4900f9eb4953d76"
};

// Global variables
let clubs = [];
let deleteConfirmId = null;
const itemHeight = 90;
let unsubscribeClubs = null;
let db = null;

// Initialize Firebase when DOM is ready
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
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Firebase functions
async function loadClubs() {
    try {
        const snapshot = await db.collection('clubs').orderBy('points', 'desc').get();
        clubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        render();
    } catch (error) {
        console.error('Error loading clubs:', error);
        // Fallback to localStorage if Firebase fails
        clubs = JSON.parse(localStorage.getItem('hexen_clubs')) || [];
        render();
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

// Real-time listener
function setupRealtimeListener() {
    unsubscribeClubs = db.collection('clubs').orderBy('points', 'desc')
        .onSnapshot((snapshot) => {
            clubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            render();
        }, (error) => {
            console.error('Real-time listener error:', error);
            // Fallback to polling localStorage
            setInterval(() => {
                const data = JSON.parse(localStorage.getItem('hexen_clubs')) || [];
                if (JSON.stringify(data) !== JSON.stringify(clubs)) { 
                    clubs = data; 
                    render(); 
                }
            }, 800);
        });
}

// Application functions
async function addClub() {
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
    const club = clubs.find(x => x.id === id);
    if (club) {
        club.points += pts;
        await saveClub(club);
    }
}

async function renameClub(id) {
    const club = clubs.find(x => x.id === id);
    const newName = prompt("Vereinsname ändern:", club.name);
    if (newName !== null && newName.trim() !== "") {
        club.name = newName.trim().toUpperCase();
        await saveClub(club);
    }
}

async function confirmDelete(id) {
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
    document.getElementById('admin-tab').classList.toggle('hidden', !isAdmin);
    document.getElementById('dashboard-tab').classList.toggle('hidden', isAdmin);
    document.getElementById('btn-admin').className = isAdmin ? 
        "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]" : 
        "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
    document.getElementById('btn-dashboard').className = !isAdmin ? 
        "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]" : 
        "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
    render();
}

function render() {
    const adminList = document.getElementById('admin-list');
    const rankingList = document.getElementById('ranking-list');

    // Admin Rendering
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

    // Dashboard Rendering
    const sorted = [...clubs].sort((a, b) => b.points - a.points);
    rankingList.style.height = `${sorted.length * itemHeight}px`;

    sorted.forEach((c, index) => {
        let el = rankingList.querySelector(`[data-id="${c.id}"]`);
        const isNew = !el;
        if (isNew) {
            el = document.createElement('div');
            el.dataset.id = c.id;
            el.dataset.points = c.points;
            el.className = 'ranking-item';
            rankingList.appendChild(el);
        }
        const pointsChanged = !isNew && parseInt(el.dataset.points) !== c.points;
        el.dataset.points = c.points;
        el.style.transform = `translateY(${index * itemHeight}px)`;
        el.innerHTML = `
            <div class="rank-box flex items-center h-20 rounded-2xl px-6 relative overflow-hidden transition-all duration-300">
                <div class="w-10 text-3xl font-black ${index < 3 ? 'gold-text' : 'text-white/20'} italic">${index + 1}</div>
                <div class="flex-1 text-white font-bold text-xl uppercase tracking-tight truncate ml-4">${c.name}</div>
                <div class="text-4xl font-black gold-text ${pointsChanged ? 'animate-pop' : ''}">${c.points}</div>
            </div>
        `;
    });

    Array.from(rankingList.children).forEach(child => {
        if (!sorted.find(c => c.id === child.dataset.id)) child.remove();
    });
}

// Countdown Timer
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
    const hours = totalHours % 24;
    const minutes = Math.floor((updatedDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((updatedDiff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');
    
    // Initialize Firebase first
    const firebaseReady = initializeFirebase();
    
    if (firebaseReady) {
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
