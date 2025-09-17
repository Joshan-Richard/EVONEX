// js/quests.js

import { updateHeaderStats } from './ui.js';
import { updateDashboardStats } from './dashboard.js';

const quests = [
    { id: 1, type: 'camera', title: 'Recycle Right', description: 'Find and scan a plastic bottle.', exp: 150 },
    { id: 2, type: 'text', title: 'Environmental Pledge', description: 'Write a short paragraph about one change you will make to help the environment.', exp: 100 },
    { id: 3, type: 'camera', title: 'Nature Spotter', description: 'Find and scan a green leaf from a tree.', exp: 75 },
    { id: 4, type: 'text', title: 'Water Saver Idea', description: 'Share one creative tip for saving water at home.', exp: 120 },
    { id: 5, type: 'camera', title: 'Can Crusader', description: 'Find and scan an aluminum can.', exp: 150 },
    { id: 6, type: 'text', title: 'Energy Saver', description: 'Describe how you reduced your electricity use today.', exp: 200 }
];

const badgeTiers = [
    { level: 1, name: 'Newbie' },
    { level: 3, name: 'Explorer' },
    { level: 5, name: 'Steward' },
    { level: 10, name: 'Guardian' }
];

let currentQuest = null;

export function initializeQuests() {
    renderQuests();
    setupModal();
}

function renderQuests() {
    const questsList = document.getElementById('quests-list');
    if (!questsList) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // --- BUG FIX IS HERE ---
    // We check if completedQuests exists before trying to use it.
    const completedQuests = currentUser.completedQuests || [];
    const availableQuests = quests.filter(quest => !completedQuests.includes(quest.id));

    if (availableQuests.length === 0) {
        questsList.innerHTML = `<div class="all-quests-complete"><i class="fas fa-check-circle"></i><h3>All quests completed!</h3><p>You're an EVONEX champion! Check back later for new challenges.</p></div>`;
        return;
    }
    
    questsList.innerHTML = availableQuests.map(quest => `
        <div class="quest-item">
            <div class="quest-info">
                <h3>${quest.title}</h3>
                <p>${quest.description}</p>
            </div>
            <div class="quest-action">
                <span class="quest-exp">+${quest.exp} EXP</span>
                <button class="btn btn-primary" data-quest-id="${quest.id}">Start Quest</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.quest-item button').forEach(button => {
        button.addEventListener('click', handleQuestClick);
    });
}

function handleQuestClick(e) {
    const questId = parseInt(e.target.dataset.questId);
    currentQuest = quests.find(q => q.id === questId);
    if (currentQuest.type === 'camera') { window.location.href = 'scan.html'; }
    else if (currentQuest.type === 'text') { openTextModal(currentQuest); }
}

function setupModal() {
    const modal = document.getElementById('text-quest-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitModalBtn = document.getElementById('modal-submit-btn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    if (submitModalBtn) submitModalBtn.addEventListener('click', () => {
        const textArea = document.getElementById('modal-textarea');
        if (textArea.value.trim().length > 10) {
            completeQuest(currentQuest);
            modal.style.display = 'none';
        } else {
            alert('Please write a more detailed response!');
        }
    });
}

function openTextModal(quest) {
    document.getElementById('modal-quest-title').textContent = quest.title;
    document.getElementById('modal-quest-desc').textContent = quest.description;
    document.getElementById('modal-textarea').value = '';
    document.getElementById('text-quest-modal').style.display = 'flex';
}

function completeQuest(quest) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser.completedQuests) currentUser.completedQuests = [];
    if (currentUser.completedQuests.includes(quest.id)) return; // Prevent re-doing quest
    
    currentUser.completedQuests.push(quest.id);
    currentUser.exp += quest.exp;
    currentUser.score += quest.exp;

    // --- NEW ROBUST LEVEL-UP LOGIC ---
    let leveledUp = false;
    // Use a while loop in case they earn enough EXP for multiple levels
    while (currentUser.exp >= currentUser.expToNextLevel) {
        leveledUp = true;
        currentUser.level++;
        currentUser.exp -= currentUser.expToNextLevel; // Subtract cost of previous level
        currentUser.expToNextLevel = Math.floor(currentUser.expToNextLevel * 1.5); // Increase cost for next level

        // Check for new badge
        const newBadge = badgeTiers.find(tier => tier.level === currentUser.level);
        if (newBadge) {
            currentUser.currentBadge = newBadge.name;
            alert(`You've earned a new badge: ${newBadge.name}!`);
        }
    }

    if (leveledUp) {
        alert(`Congratulations! You've reached Level ${currentUser.level}!`);
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update all relevant UI parts
    updateHeaderStats(currentUser);
    updateDashboardStats(currentUser); // Update the dashboard if it's the current view
    renderQuests(); // Re-render quests to make the completed one vanish
}