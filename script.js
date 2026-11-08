// State Management
let guests = [
    { name: "Vikram Malhotra", category: "Groom Side", status: "Confirmed", diet: "Vegetarian", plusOne: 1 },
    { name: "Priya Sharma", category: "Bride Side", status: "Confirmed", diet: "Non-Veg", plusOne: 2 },
    { name: "Kabir Mehta", category: "VIP Friend", status: "Pending", diet: "Jain", plusOne: 0 },
    { name: "Rohan Kapoor", category: "Groom Side", status: "Declined", diet: "Vegetarian", plusOne: 0 },
    { name: "Sneha Reddy", category: "Bride Side", status: "Confirmed", diet: "Vegetarian", plusOne: 1 }
];

let budgetItems = [
    { category: "Venue & Catering", estimated: 800000, spent: 850000 },
    { category: "Photography & Video", estimated: 250000, spent: 220000 },
    { category: "Decoration & Floral", estimated: 300000, spent: 280000 },
    { category: "Attire & Makeup", estimated: 150000, spent: 140000 }
];

let itinerary = [
    { time: "04:00 PM", title: "Baraat Welcome & Garlands", desc: "Palace Main Gateway Entrance" },
    { time: "06:30 PM", title: "Pheras Ceremony", desc: "Mandap area near Central Fountain" },
    { time: "08:30 PM", title: "Grand Reception & Dinner", desc: "Royal Ballroom Lawn" }
];

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCountdown();
    renderDashboard();
    renderGuests();
    renderBudget();
    renderTimeline();
    renderSeating();
    initFilters();

    document.getElementById("rsvpForm").addEventListener("submit", handleAddGuest);
});

// Navigation Tabs
function initNavigation() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
            item.classList.add("active");

            const tab = item.getAttribute("data-tab");
            document.querySelectorAll(".content-view").forEach(view => view.classList.remove("active"));
            document.getElementById(tab + "View").classList.add("active");
        });
    });
}

// Countdown Timer
function initCountdown() {
    const targetDate = new Date("December 18, 2026 18:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if(diff > 0) {
            document.getElementById("days").innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
            document.getElementById("hours").innerText = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            document.getElementById("minutes").innerText = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            document.getElementById("seconds").innerText = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
        }
    }, 1000);
}

// Render Overview Dashboard
function renderDashboard() {
    const totalCount = guests.reduce((acc, g) => acc + 1 + parseInt(g.plusOne), 0);
    const confirmedCount = guests.filter(g => g.status === "Confirmed").reduce((acc, g) => acc + 1 + parseInt(g.plusOne), 0);
    const vegCount = guests.filter(g => g.diet === "Vegetarian" || g.diet === "Jain").length;
    const vegRatio = guests.length > 0 ? Math.round((vegCount / guests.length) * 100) : 0;

    document.getElementById("statTotalGuests").innerText = totalCount;
    document.getElementById("statConfirmedGuests").innerText = confirmedCount;
    document.getElementById("statVegRatio").innerText = `${vegRatio}% Veg/Jain`;

    // Render Recent RSVPs
    const tbody = document.getElementById("recentRsvpBody");
    tbody.innerHTML = guests.slice(0, 4).map(g => `
        <tr>
            <td><strong>${g.name}</strong></td>
            <td>${g.category}</td>
            <td><span class="status-pill ${g.status.toLowerCase()}">${g.status}</span></td>
            <td>${g.diet}</td>
        </tr>
    `).join("");

    // Render Budget Progress
    const progressList = document.getElementById("budgetProgressList");
    progressList.innerHTML = budgetItems.map(b => {
        const pct = Math.min(Math.round((b.spent / b.estimated) * 100), 100);
        return `
            <div class="budget-item">
                <div class="budget-info">
                    <span>${b.category}</span>
                    <span>₹${b.spent.toLocaleString()} / ₹${b.estimated.toLocaleString()}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${pct}%;"></div></div>
            </div>
        `;
    }).join("");
}

// Render Full Guestlist
function renderGuests(data = guests) {
    const tbody = document.getElementById("fullGuestBody");
    tbody.innerHTML = data.map((g, index) => `
        <tr>
            <td><strong>${g.name}</strong></td>
            <td>${g.category}</td>
            <td><span class="status-pill ${g.status.toLowerCase()}">${g.status}</span></td>
            <td>${g.diet}</td>
            <td>+${g.plusOne}</td>
            <td><button class="primary-btn" style="padding: 4px 8px; font-size: 0.75rem;" onclick="removeGuest(${index})"><i class="fa-solid fa-trash"></i></button></td>
        </tr>
    `).join("");
}

// Render Budget Table
function renderBudget() {
    const tbody = document.getElementById("budgetTableBody");
    tbody.innerHTML = budgetItems.map(b => `
        <tr>
            <td><strong>${b.category}</strong></td>
            <td>₹${b.estimated.toLocaleString()}</td>
            <td>₹${b.spent.toLocaleString()}</td>
            <td><span class="status-pill ${b.spent <= b.estimated ? 'confirmed' : 'declined'}">${b.spent <= b.estimated ? 'Under Budget' : 'Over Budget'}</span></td>
        </tr>
    `).join("");
}

// Render Timeline
function renderTimeline() {
    const container = document.getElementById("timelineContainer");
    container.innerHTML = itinerary.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${item.time} — ${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        </div>
    `).join("");
}

// Render Seating Cards
function renderSeating() {
    const grid = document.getElementById("seatingGrid");
    const tables = ["Royal Family Table 1", "Groom Cousins Table 2", "Bride VIP Friends Table 3", "General Guests Table 4"];
    grid.innerHTML = tables.map(t => `
        <div class="table-card-item">
            <i class="fa-solid fa-chair" style="font-size: 1.5rem; color: var(--accent-rose); margin-bottom: 6px;"></i>
            <h4>${t}</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">8/8 Seats Allocated</p>
        </div>
    `).join("");
}

// Filters & Modals
function initFilters() {
    document.getElementById("guestSearch").addEventListener("input", filterGuests);
    document.getElementById("guestFilter").addEventListener("change", filterGuests);
}

function filterGuests() {
    const search = document.getElementById("guestSearch").value.toLowerCase();
    const filter = document.getElementById("guestFilter").value;

    const filtered = guests.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(search);
        const matchesStatus = filter === "all" || g.status === filter;
        return matchesSearch && matchesStatus;
    });

    renderGuests(filtered);
}

function openRsvpModal() { document.getElementById("rsvpModal").style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

function handleAddGuest(e) {
    e.preventDefault();
    const newGuest = {
        name: document.getElementById("modalGuestName").value,
        category: document.getElementById("modalGuestCategory").value,
        status: document.getElementById("modalGuestStatus").value,
        diet: document.getElementById("modalGuestDiet").value,
        plusOne: parseInt(document.getElementById("modalGuestPlusOne").value)
    };

    guests.unshift(newGuest);
    closeModal('rsvpModal');
    renderDashboard();
    renderGuests();
    showToast("Guest record added successfully!");
    document.getElementById("rsvpForm").reset();
}

function removeGuest(index) {
    guests.splice(index, 1);
    renderDashboard();
    renderGuests();
    showToast("Guest removed.");
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}