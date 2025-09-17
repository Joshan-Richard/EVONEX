// js/dashboard.js

// This function is exported to be called by the router in app.js
export function initializeDashboard(currentUser) {
    if (!currentUser) return;

    const welcomeMessage = document.getElementById('welcome-message');
    if(welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.fullname}!`;
    }

    // Populate stats when the page first loads
    updateDashboardStats(currentUser);

    const levelUpBtn = document.getElementById('level-up-btn');
    if (levelUpBtn) {
        levelUpBtn.addEventListener('click', () => {
            document.querySelector('.nav-link[data-page="quests"]').click();
        });
    }
    
    startActivityFeed();
}

// --- NEW EXPORTED FUNCTION ---
// Allows quests.js to update the dashboard after a level up
export function updateDashboardStats(currentUser) {
    if (!document.querySelector('.dashboard-container')) return; // Only run if dashboard is visible

    const expNeeded = currentUser.expToNextLevel || 500;
    const exp = currentUser.exp || 0;
    const userLevel = document.getElementById('user-level');
    const userExpText = document.getElementById('user-exp-text');
    const userExpBar = document.getElementById('user-exp-bar');
    
    if(userLevel) userLevel.textContent = currentUser.level || 1;
    if(userExpText) userExpText.textContent = `${exp} / ${expNeeded} XP`;
    if(userExpBar) userExpBar.style.width = `${(exp / expNeeded) * 100}%`;
}



function startActivityFeed() {
    const feedList = document.getElementById('activity-feed-list');
    if (!feedList) return;

    const activities = [
        "Alex just earned the 'Recycle Rookie' badge!",
        "Sam completed the 'Water Conservation' module.",
        "A new 'Community Cleanup' challenge has started!",
        "Maria reached Level 5!",
        "The 'Green Thumbs' team is now #1 on the leaderboard.",
        "David just scored 150 points in the weekly quiz."
    ];
    
    // Clear any existing intervals to prevent duplicates
    if (window.activityFeedInterval) {
        clearInterval(window.activityFeedInterval);
    }

    // Set a new interval
    window.activityFeedInterval = setInterval(() => {
        if (feedList.children.length >= 5) {
            feedList.removeChild(feedList.lastChild);
        }
        const activityItem = document.createElement('li');
        activityItem.className = 'activity-item';
        activityItem.textContent = activities[Math.floor(Math.random() * activities.length)];
        feedList.prepend(activityItem);
    }, 4000);
}