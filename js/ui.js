// js/ui.js

// This function will be called by app.js to set up all UI event listeners
export function initializeUI(currentUser) {
    const sidebar = document.getElementById('sidebar');
    const burgerMenu = document.getElementById('burger-menu');
    // --- NEW: Get the overlay element ---
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (burgerMenu && sidebar && sidebarOverlay) {
        // When burger is clicked, toggle sidebar AND overlay
        burgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            sidebarOverlay.classList.toggle('active');
        });

        // --- NEW: When overlay is clicked, close sidebar AND overlay ---
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            sidebarOverlay.classList.remove('active');
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    populateLayout(currentUser);
}

// --- NEW EXPORTED FUNCTION for updating header stats ---
// This can be called from other modules (like quests.js) after a user levels up.
export function updateHeaderStats(currentUser) {
    if (!currentUser) return;
    const userBadge = document.getElementById('user-badge');
    const userScore = document.getElementById('user-score');

    if (userBadge) userBadge.textContent = currentUser.currentBadge || 'Newbie';
    if (userScore) userScore.textContent = `${currentUser.score || 0} Score`;
}


// --- SINGLE, CORRECT VERSION of populateLayout ---
// This function now correctly calls updateHeaderStats.
function populateLayout(currentUser) {
    if (!currentUser) return;

    // Call the header update function
    updateHeaderStats(currentUser); 
    
    // Populate the rest of the layout (e.g., the profile dropdown)
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        profileLink.textContent = `Signed in as ${currentUser.fullname}`;
    }
}