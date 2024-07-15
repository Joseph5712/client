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

          console.log('Response status:', response.status);  // Depuración: Verificar el estado de la respuesta

          if (!response.ok) {
              const errorData = await response.json();
              console.log('Error response:', errorData);  // Depuración: Verificar el contenido de la respuesta de error
              throw new Error('Login failed');
          }

          const result = await response.json();
          console.log('Login successful:', result);

          // Redireccionar a otra página después del login exitoso
          window.location.href = '/client/dashboard.html'; // Reemplaza con la ruta de tu dashboard o página principal

      } catch (error) {
          console.error('Error during login:', error);
          // Mostrar un mensaje de error en el frontend si lo necesitas
          alert('Login failed. Please check your credentials.');
      }
  });
});
