const API_BASE_URL = 'http://localhost:3000/api/auth';

// Helper to show message banner
function showMessage(elementId, message, type) {
    const msgBox = document.getElementById(elementId);
    if (!msgBox) return;
    
    msgBox.textContent = message;
    msgBox.className = `form-message ${type}`;
    msgBox.style.display = 'block';
}

// Helper to highlight a specific input box red
function highlightError(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        // Find the parent .input-box wrapper and add the red outline class
        const inputBox = inputElement.closest('.input-box');
        if (inputBox) {
            inputBox.classList.add('error-input');
            
            // Remove the red outline once the user starts typing again
            inputElement.addEventListener('input', () => {
                inputBox.classList.remove('error-input');
            }, { once: true });
        }
    }
}

// Clear all highlights
function clearHighlights() {
    document.querySelectorAll('.input-box').forEach(box => {
        box.classList.remove('error-input');
    });
}

// ==================== REGISTRATION ====================
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearHighlights();
        
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm_password = document.getElementById('confirm_password').value;

        // Check password match
        if (password !== confirm_password) {
            showMessage('form-message', 'Passwords do not match!', 'error');
            highlightError('register-password');
            highlightError('confirm_password');
            return;
        }

        // Check password length
        if (password.length < 8) {
            showMessage('form-message', 'Password must be at least 8 characters long.', 'error');
            highlightError('register-password');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name, last_name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('form-message', 'Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showMessage('form-message', data.error || 'Registration failed', 'error');
                if (data.error && data.error.toLowerCase().includes('email')) {
                    highlightError('register-email');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('form-message', 'Could not connect to the server.', 'error');
        }
    });
}

// ==================== LOGIN ====================
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearHighlights();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                showMessage('form-message', `Welcome back, ${data.user.first_name}! Redirecting...`, 'success');
                
                setTimeout(() => {
                    window.location.href = 'profile.html'; 
                }, 1200);
            } else {
                showMessage('form-message', data.error || 'Invalid email or password', 'error');
                highlightError('login-email');
                highlightError('login-password');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('form-message', 'Could not connect to the server.', 'error');
        }
    });
}