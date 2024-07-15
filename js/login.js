document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const formData = new FormData(loginForm);
      const email = formData.get('email');
      const password = formData.get('password');
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error('Login failed');
        }
  
        // Redireccionar a otra página después del login exitoso
        window.location.href = '/client/dashboard.html'; // Reemplaza con la ruta de tu dashboard o página principal
  
      } catch (error) {
        console.error('Error during login:', error);
        // Mostrar un mensaje de error en el frontend si lo necesitas
        alert('Login failed. Please check your credentials.');
      }
    });
  });
  