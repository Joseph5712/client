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
      role: 'client'
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
  
<<<<<<< HEAD
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
=======
  }


>>>>>>> 2702c7ddc4c44705c632d1c0364dd52babc9cd82
