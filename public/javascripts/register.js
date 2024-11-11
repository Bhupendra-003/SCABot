document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const passwordStrength = calculatePasswordStrength(password);
    const passwordStrengthElement = document.getElementById('password-strength');

    // Set the color based on strength
    if (passwordStrength === 'Weak') {
        passwordStrengthElement.style.color = 'red';
    } else if (passwordStrength === 'Medium') {
        passwordStrengthElement.style.color = 'orange';
    } else if (passwordStrength === 'Strong') {
        passwordStrengthElement.style.color = 'green';
    } else {
        passwordStrengthElement.style.color = 'black'; // Default color
    }

    passwordStrengthElement.textContent = passwordStrength;
});

function calculatePasswordStrength(password) {
    const passwordLength = password.length;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

    // If the password is empty
    if (passwordLength === 0) {
        return '';
    }

    // Weak conditions
    if (passwordLength < 5) {
        return 'Weak';
    }

    // Medium conditions
    if (passwordLength >= 5 && passwordLength < 8) {
        if (hasLetters && hasNumbers) {
            return 'Medium';
        } else {
            return 'Weak';
        }
    }

    // Strong conditions
    if (passwordLength >= 8 && hasLetters && hasNumbers && hasSpecialChars) {
        return 'Strong';
    }

    // Default fallback for weak
    return 'Weak';
}

const eye = document.querySelector('.pass-cont i');
eye.addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eye.classList.remove('fa-eye-slash');
        eye.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        eye.classList.remove('fa-eye');
        eye.classList.add('fa-eye-slash');
    }
});