/*
// Simple login helper for demo purposes

document.addEventListener(\'DOMContentLoaded\', function() {
    console.log(\'Login helper initialized\');
    
    // Add demo login credentials button
    const loginForm = document.getElementById(\'loginForm\');
    if (loginForm) {
        // Add helper button for easy login during development
        const loginHelperBtn = document.createElement(\'button\');
        loginHelperBtn.type = \'button\';
        loginHelperBtn.className = \'login-helper-btn\';
        loginHelperBtn.innerHTML = \'استخدام حساب تجريبي\';
        loginHelperBtn.style.cssText = `
            background: transparent;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            margin-top: 10px;
            font-size: 0.9rem;
            text-decoration: underline;
            display: block;
            width: 100%;
            text-align: center;
        `;
        
        loginHelperBtn.addEventListener(\'click\', function() {
            const usernameInput = document.getElementById(\'username\');
            const passwordInput = document.getElementById(\'password\');
            
            if (usernameInput && passwordInput) {
                usernameInput.value = \'admin@kurdtech.com\';
                passwordInput.value = \'admin123\';
            }
        });
        
        loginForm.appendChild(loginHelperBtn);
    }
    
    // Override authentication to allow any login
    if (window.authManager) {
        console.log(\'Patching authentication for demo\');
        const originalSignIn = window.authManager.signIn;
        
        window.authManager.signIn = async function(email, password) {
            console.log(\'Using demo authentication\');
            
            // For demo, accept any credentials
            if (email && password) {
                // Return a mock user object
                const mockUser = {
                    uid: \'demo-user-123\',
                    email: email,
                    displayName: \'مدير النظام\',
                    role: \'admin\'
                };
                
                this.currentUser = mockUser;
                
                // Notify callbacks
                this.authCallbacks.forEach(callback => {
                    if (typeof callback === \'function\') {
                        callback(mockUser);
                    }
                });
                
                return mockUser;
            } else {
                throw new Error(\'يرجى إدخال البريد الإلكتروني وكلمة المرور\');
            }
        };
    }
});
*/
