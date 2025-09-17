// js/ui.js

export function initializeUI(currentUser) {
    const sidebar = document.getElementById('sidebar');
    const burgerMenu = document.getElementById('burger-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (burgerMenu && sidebar && sidebarOverlay) {
        // --- FIX: Use a clear class 'is-open' to toggle visibility ---
        burgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
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

export function updateHeaderStats(currentUser) {
    if (!currentUser) return;
    const userBadge = document.getElementById('user-badge');
    const userScore = document.getElementById('user-score');

    if (userBadge) userBadge.textContent = currentUser.currentBadge || 'Newbie';
    if (userScore) userScore.textContent = `${currentUser.score || 0} Score`;
}

function populateLayout(currentUser) {
    if (!currentUser) return;
    updateHeaderStats(currentUser);
    
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        profileLink.textContent = `Signed in as ${currentUser.fullname}`;
    }
}