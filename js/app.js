// js/app.js

import { initializeUI } from './ui.js';
import { initializeDashboard } from './dashboard.js';
import { initializeQuests } from './quests.js';
import { displayRandomQuote } from './utils.js';

// --- GLOBAL AUTHENTICATION CHECK ---
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('register.html')) {
        window.location.href = 'login.html';
    }
}

// --- PAGE ROUTER & INITIALIZATION ---
const pageScripts = {
    'dashboard': initializeDashboard,
    'quests': initializeQuests,
};

async function loadPageContent(page, setActiveLink = true) {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch(`${page}.html`);
        if (!response.ok) throw new Error(`Page not found: ${page}.html`);
        
        mainContent.innerHTML = await response.text();
        
        if (pageScripts[page]) {
            pageScripts[page](currentUser);
        }

        // Update the active link in the sidebar
        if (setActiveLink) {
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => {
                l.classList.remove('active');
                if (l.dataset.page === page) {
                    l.classList.add('active');
                }
            });
        }

    } catch (error) {
        console.error('Error loading page:', error);
        mainContent.innerHTML = `<p class="error-message">Error: Could not load page content.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) {
        return;
    }
    
    if (!currentUser) return;
    
    // --- INITIALIZE THE APP ---
    initializeUI(currentUser);
    displayRandomQuote();

    // *********** THE BUG FIX IS HERE ***********
    // Create a URL parser to read the "?page=" parameter
    const params = new URLSearchParams(window.location.search);
    // Get the page from the parameter, OR default to 'dashboard'
    const currentPage = params.get('page') || 'dashboard';

    // Load the initial page content based on the logic above
    loadPageContent(currentPage);

    // --- NAVIGATION LINK LISTENERS ---
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Load the new page content
            loadPageContent(page);
            
            // Update the URL in the browser's address bar
            history.pushState({ page: page }, '', `layout.html?page=${page}`);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            loadPageContent(e.state.page);
        } else {
            // If history state is null, default to dashboard
            loadPageContent('dashboard');
        }
    });
});