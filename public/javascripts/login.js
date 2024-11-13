const form = document.querySelector('form');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = form.email?.value?.trim();
        const password = form.password?.value;
        const errorElement = document.getElementById('error-message');

        try {
            const response = await fetch('/validate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.status === 401 || response.status === 404) {
                if (errorElement) {
                    console.log(result.message);
                    console.log('Error');
                    errorElement.textContent = result.message;
                }
            } else if (response.status === 200) {
                // Redirect or handle successful registration
                console.log('Redirecting to chat...');
                window.location.assign('/chat');
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            if (errorElement) {
                errorElement.textContent = 'An error occurred during registration';
            }
        }
    });
}
