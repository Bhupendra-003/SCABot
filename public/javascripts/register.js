document.getElementById('password').addEventListener('input', function () {
    const password = this.value.trim();
    const passwordStrength = calculatePasswordStrength(password);
    const passwordStrengthElement = document.getElementById('password-strength');

    if (!passwordStrengthElement) return;

    const strengthColors = {
        'Weak': 'red',
        'Medium': 'orange',
        'Strong': 'green',
        '': 'black'
    };

    passwordStrengthElement.style.color = strengthColors[passwordStrength] || 'black';
    passwordStrengthElement.textContent = passwordStrength;
});

function calculatePasswordStrength(password) {
    if (!password || password.length === 0) return '';

    const criteria = {
        length: password.length,
        hasLetters: /[a-zA-Z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChars: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password)
    };

    if (criteria.length < 5) return 'Weak';

    if (criteria.length >= 5 && criteria.length < 8) {
        return (criteria.hasLetters && criteria.hasNumbers) ? 'Medium' : 'Weak';
    }

    if (criteria.length >= 8 && 
        criteria.hasUpperCase && 
        criteria.hasLowerCase && 
        criteria.hasNumbers && 
        criteria.hasSpecialChars) {
        return 'Strong';
    }

    return 'Weak';
}

const eye = document.querySelector('.pass-cont i');
if (eye) {
    eye.addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eye.classList.toggle('fa-eye-slash', !isPassword);
        eye.classList.toggle('fa-eye', isPassword);
    });
}

const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = form.email?.value?.trim();
        const password = form.password?.value;
        const errorElement = document.getElementById('error-message');

        try {
            const response = await fetch('/create', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.status === 409) {
                if (errorElement) {
                    console.log(result.message);
                    errorElement.textContent = result.message;
                }
            } else if (response.ok) {
                // Redirect or handle successful registration
                window.location.href = '/register';
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            if (errorElement) {
                errorElement.textContent = 'An error occurred during registration';
            }
        }
    });
}
