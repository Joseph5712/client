function assignEditEvents() {
    for (let el of document.getElementsByClassName('edit_button')) {
      el.addEventListener('click', (e) => {
        console.log(e.target.id);
        alert(`element with id ${e.target.id} clicked`);
        e.preventDefault();
      });
    }
  }
  async function getRides() {
    const response = await fetch("http://localhost:3001/api/rides", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const rides = await response.json();
  
    if (rides) {
      const tableBody = document.getElementById('ride-table-body');
      tableBody.innerHTML = '';
  
      rides.forEach(ride => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${ride.arriveTo}</td>
          <td>${ride.departureFrom}</td>
          <td>${ride.seats}</td>
          <td>${ride.car}</td>
          <td>${ride.fee}</td>
          <td><a href="#" class="edit_button" id="${ride._id}">Edit</a></td>
        `;
        tableBody.appendChild(row);
      });
  
      assignEditEvents();
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
    console.log(user.role);
  
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


document.getElementById('rideForm').addEventListener('submit', createRide);

async function createRide(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario
    let days = {
        mon: document.getElementById('mon').checked,
        tue: document.getElementById('tue').checked,
        wed: document.getElementById('wed').checked,
        thu: document.getElementById('thu').checked,
        fri: document.getElementById('fri').checked,
        sat: document.getElementById('sat').checked,
        sun: document.getElementById('sun').checked
    };

    let ride = {
        departureFrom: document.getElementById('departure').value,
        arriveTo: document.getElementById('arrived').value,
        days: days,
        time: document.getElementById('time').value,
        seats: document.getElementById('seats').value,
        fee: document.getElementById('fee').value,
        vehicleDetails: {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value
        }
    };

    // Enviar los datos del ride
    let response = await fetch("http://localhost:3001/api/rides", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ride)
    });

    if (response.ok) {
        let rideData = await response.json();
        console.log('Ride created:', rideData);
        alert('Ride created successfully');
    } else {
        alert('Error creating ride');
    }
}


