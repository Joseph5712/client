document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const googleRegisterButton = document.getElementById('google-register-button');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const registerData = Object.fromEntries(formData.entries());

        // Convert formData entries to a format that the backend expects
        const formattedData = {
            firstName: registerData['first-name'],
            lastName: registerData['last-name'],
            cedula: registerData['cedula'],
            birthday: registerData['birthday'],
            email: registerData['email'],
            password: registerData['password'],
            repeatPassword: registerData['repeat-password'],
            address: registerData['address'],
            country: registerData['country'],
            state: registerData['state'],
            city: registerData['city'],
            phone: registerData['phone'],
            role: registerData['role'],
        };

        try {
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: `Bienvenido, ${formattedData.firstName}!`,
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/login.html';
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error en el registro: ${errorData.message || 'Algo salió mal.'}`,
                    confirmButtonText: 'OK'
                });
                console.error('Error registering:', errorData.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.',
                confirmButtonText: 'OK'
            });
            console.error('Error registering:', error);
        }
    });

    googleRegisterButton.addEventListener('click', () => {
        window.location.href = '/auth/google/register'; // Usar la ruta de registro de Google
    });
});
