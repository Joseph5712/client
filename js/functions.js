function assignEditEvents() {
    for (let el of document.getElementsByClassName('edit_button')) {
      el.addEventListener('click', (e) => {
        console.log(e.target.id);
        alert(`element with id ${e.target.id} clicked`);
        e.preventDefault();
      });
    }
  }
  
  async function createUser(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
  
    let user = {
      first_name: document.getElementById('first_name').value,
      last_name: document.getElementById('last_name').value,
      cedula: document.getElementById('cedula').value,
      birthday: document.getElementById('birthday').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      phone_number: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      country: document.getElementById('country').value,
      state: document.getElementById('state').value,
      city: document.getElementById('city').value,
      role: document.getElementById('role').value
    }
  
    const response = await fetch("http://localhost:3001/api/user", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic x' // Reemplaza con tu autenticación si es necesaria
      },
      body: JSON.stringify(user)
    });
  
    debugger;
    if(response && response.status == 201){
      user = await response.json();
      console.log('User saved', user);
      alert('Usuario guardado');
    } else {
      alert("Shit's on fire! ");
    }
  
  }



  document.addEventListener('DOMContentLoaded', function () {
    const password = document.getElementById('password');
    const repeatPassword = document.getElementById('repeat-password');
    const passwordError = document.getElementById('password-error');
    const address = document.getElementById('address');
  
    repeatPassword.addEventListener('blur', function () {
      if (password.value !== repeatPassword.value) {
        passwordError.textContent = 'Passwords do not match';
      } else {
        passwordError.textContent = '';
      }
    });
  
    address.addEventListener('focus', function () {
      if (password.value !== repeatPassword.value) {
        passwordError.textContent = 'Passwords do not match';
      } else {
        passwordError.textContent = '';
      }
    });
  });


// functions.js

async function login() {
  try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          alert(`Login successful for ${data.user.email}`);
          // Aquí podrías redirigir al usuario al dashboard u otra página
      } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.error}`);
      }
  } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed: Internal error');
  }
}




