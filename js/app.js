let clubs = JSON.parse(localStorage.getItem('hexen_clubs')) || [];
let deleteConfirmId = null;
const itemHeight = 90;

function save() {
    localStorage.setItem('hexen_clubs', JSON.stringify(clubs));
    render();
}

function addClub() {
    const input = document.getElementById('clubName');
    if (!input.value.trim()) return;
    clubs.push({ id: Date.now(), name: input.value.trim().toUpperCase(), points: 0 });
    input.value = '';
    save();
}

function addPoints(id, pts) {
    const c = clubs.find(x => x.id === id);
    if (c) { c.points += pts; save(); }
}

function renameClub(id) {
    const c = clubs.find(x => x.id === id);
    const newName = prompt("Vereinsname ändern:", c.name);
    if (newName !== null && newName.trim() !== "") {
        c.name = newName.trim().toUpperCase();
        save();
    }
}

function confirmDelete(id) {
    if (deleteConfirmId === id) {
        clubs = clubs.filter(x => x.id !== id);
        deleteConfirmId = null;
        save();
    } else {
        deleteConfirmId = id;
        render();
        // Nach 3 Sekunden Reset, wenn nicht bestätigt wurde
        setTimeout(() => { if(deleteConfirmId === id) { deleteConfirmId = null; render(); } }, 3000);
    }
}

function switchTab(tab) {
    const isAdmin = tab === 'admin';
    document.getElementById('admin-tab').classList.toggle('hidden', !isAdmin);
    document.getElementById('dashboard-tab').classList.toggle('hidden', isAdmin);
    document.getElementById('btn-admin').className = isAdmin ? "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]" : "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
    document.getElementById('btn-dashboard').className = !isAdmin ? "px-5 py-2 rounded-lg text-sm font-bold bg-[#e4c342] text-[#3f755f]" : "px-5 py-2 rounded-lg text-sm font-bold text-white/50";
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
                     <button onclick="renameClub(${c.id})" class="text-gray-400 hover:text-[#3f755f]">✎</button>
                     <button onclick="confirmDelete(${c.id})" class="text-xs px-2 py-1 rounded transition-colors ${deleteConfirmId === c.id ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:text-red-500'}">
                        ${deleteConfirmId === c.id ? 'SICHER?' : '✕'}
                     </button>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="addPoints(${c.id}, 1)" class="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-sm hover:bg-gray-200">+1</button>
                <button onclick="addPoints(${c.id}, 3)" class="flex-1 bg-[#e4c342]/20 border border-[#e4c342] py-3 rounded-xl font-bold text-sm hover:bg-[#e4c342]/40">+3</button>
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
        if (!sorted.find(c => c.id.toString() === child.dataset.id)) child.remove();
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
        // If it's Saturday 0:00 or later, count to next Saturday
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

// Initialize
window.addEventListener('storage', (e) => { if (e.key === 'hexen_clubs') { clubs = JSON.parse(e.newValue); render(); } });
setInterval(() => {
    const data = JSON.parse(localStorage.getItem('hexen_clubs')) || [];
    if (JSON.stringify(data) !== JSON.stringify(clubs)) { clubs = data; render(); }
}, 800);
setInterval(updateCountdown, 1000);
render();
updateCountdown();
