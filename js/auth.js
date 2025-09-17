document.addEventListener('DOMContentLoaded', () => {
    // --- NEW: Redirect if already logged in ---
    // If a user is logged in and tries to visit login.html or register.html,
    // send them straight to the main app layout.
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedInUser) {
        if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) {
            window.location.href = 'layout.html';
            return; // Stop running the rest of the script on this page
        }
    }
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const roleSelect = document.getElementById('role-select');

    // --- REGISTRATION LOGIC ---
    if (registerForm) {
        roleSelect.addEventListener('change', (e) => {
            const role = e.target.value;
            const schoolField = document.getElementById('school-field');
            const ngoField = document.getElementById('ngo-field');
            const schoolInput = document.getElementById('school-name');
            const ngoInput = document.getElementById('ngo-name');

            if (role === 'student' || role === 'teacher') {
                schoolField.style.display = 'block'; schoolInput.required = true;
                ngoField.style.display = 'none'; ngoInput.required = false;
            } else if (role === 'ngo') {
                ngoField.style.display = 'block'; ngoInput.required = true;
                schoolField.style.display = 'none'; schoolInput.required = false;
            } else {
                schoolField.style.display = 'none'; ngoField.style.display = 'none';
                schoolInput.required = false; ngoInput.required = false;
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const errorMessage = document.getElementById('register-error-message');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const email = registerForm.email.value;
            
            if (users.find(user => user.email === email)) {
                errorMessage.textContent = 'An account with this email already exists.';
                return;
            }

           const newUser = {
    id: Date.now(),
    fullname: registerForm.fullname.value,
    email: email,
    password: registerForm.password.value,
    role: registerForm.role.value,
    school: registerForm.school ? registerForm.school.value : null,
    organization: registerForm.organization ? registerForm.organization.value : null,
    score: 0,
    exp: 0,
    level: 1,
    // --- NEW LEVELING PROPERTY ---
    expToNextLevel: 500, // Starts at 500 for Level 1
    currentBadge: 'Newbie',
    badges: ['Newbie'],
    completedQuests: []
};

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'layout.html'; 
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const errorMessage = document.getElementById('login-error-message');
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'layout.html';
            } else {
                errorMessage.textContent = 'Invalid email or password. Please try again.';
            }
        });
    }
});

// --- LOGOUT FUNCTION ---
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}