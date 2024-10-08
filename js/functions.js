// funcion para asignar eventos de edición a los botones Editar
function assignEditEvents() {
  for (let el of document.getElementsByClassName("edit_button")) {
    el.addEventListener("click", (e) => {
      console.log(e.target.id);
      alert(`element with id ${e.target.id} clicked`);
      e.preventDefault();
    });
  }
}

async function getClientBookings() {
  const userId = localStorage.getItem('userId'); // Obtener el userId del localStorage
  
  if (!userId) {
    console.error("User ID not found in localStorage");
    return;
  }
  
  try {
      const response = await fetch("http://localhost:3001/api/bookingsClient", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const bookings = await response.json();
      console.log(bookings);

      // Filtrar los bookings para mostrar solo los del usuario logueado
      const clientBookings = bookings.filter(booking => booking.user._id === userId);

      const tableBody = document.getElementById("ride-table-body");
      tableBody.innerHTML = "";

      clientBookings.forEach((booking) => {
          const row = document.createElement("tr");
          row.id = `booking-${booking._id}`;
          row.innerHTML = `
              <td>${booking.ride.departureFrom}</td>  
              <td>${booking.ride.arriveTo}</td>
              <td>${booking.ride.seats}</td>
              <td>${booking.ride.vehicleDetails.make}</td>
              <td>${booking.ride.fee}</td>
              <td><a href="#" class="cancel_button" onclick="cancelBooking('${booking._id}')">Cancel</a></td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Error fetching client bookings:', error.message);
      alert("Error fetching client bookings: " + error.message);
  }
}





  //se muestra los bookings del usuario que haya hecho un request del ride del driver que la
  async function getBookings_user() {
    const driverId = localStorage.getItem('userId'); // Recupera el ID del usuario logueado desde el localStorage

    if (!driverId) {
        console.error('No driver ID found in localStorage');
        return;
    }

    const response = await fetch(`http://localhost:3001/api/bookings?driverId=${driverId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const bookings = await response.json();

    if (bookings) {
        const tableBody = document.getElementById('booking-table-body');
        tableBody.innerHTML = '';

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.user ? booking.user.first_name + ' ' + booking.user.last_name : 'N/A'}</td>
                <td>${booking.ride ? booking.ride.departureFrom : 'N/A'}</td>
                <td>${booking.ride ? booking.ride.arriveTo : 'N/A'}</td>
                <td><a href="#" class="accept_button" id="accept" onclick="acceptBooking('${booking._id}')">Accept</a> | <a href="#" class="reject_button" onclick="rejectBooking('${booking._id}')">Reject</a></td>
            `;
            tableBody.appendChild(row);
        });
    }
}




//crear user(depende del formulario, se crea el user con rol: driver o client)
async function createUser(event) {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  let user = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    cedula: document.getElementById("cedula").value,
    birthday: document.getElementById("birthday").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone_number: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    city: document.getElementById("city").value,
    role: document.getElementById("role").value,
  };

  const response = await fetch("http://localhost:3001/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic x", // Reemplaza con tu autenticación si es necesaria
    },
    body: JSON.stringify(user),
  });

  debugger;
  if (response && response.status == 201) {
    user = await response.json();
    console.log("User saved", user);
    alert("Usuario guardado");
  } else {
    alert("Shit's on fire! ");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const password = document.getElementById("password");
  const repeatPassword = document.getElementById("repeat-password");
  const passwordError = document.getElementById("password-error");
  const address = document.getElementById("address");

  repeatPassword.addEventListener("blur", function () {
    if (password.value !== repeatPassword.value) {
      passwordError.textContent = "Passwords do not match";
    } else {
      passwordError.textContent = "";
    }
  });

  address.addEventListener("focus", function () {
    if (password.value !== repeatPassword.value) {
      passwordError.textContent = "Passwords do not match";
    } else {
      passwordError.textContent = "";
    }
  });
});

//se valida el login 
async function login(event) {
  

  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.user && data.user._id) {
        alert(`Login successful for ${data.user.email}`);
        // Almacenar el userId local storage
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userRole', data.user.role);

        // Redirigir segun el rol del usuario
        switch (data.user.role) {
          case 'driver':
            window.location.href = '../rides/rides_drivers.html';
            break;
          case 'user':
            window.location.href = '../rides/Home.html';
            break;
        } 
      } else {
        console.error("User ID is missing in the response");
        alert("Login failed: User ID is missing");
      }
    } else {
      const errorData = await response.json();
      console.log("Login failed response:", errorData);
      alert(`Login failed: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed: Internal error");
  }
}
document.getElementById("rideForm").addEventListener("submit", createRide);

//creacion del ride
async function createRide(event) {
  event.preventDefault();
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
      },
      userId: localStorage.getItem('userId') // Obtener el userId desde el local storage
      
  };

  try {
    let response = await fetch("http://localhost:3001/api/rides", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ride)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let rideData = await response.json();
    console.log("Ride created:", rideData);
    alert("Ride created successfully");
} catch (error) {
    console.error('Error creating ride:', error.message);
    alert("Error creating ride: " + error.message);
}
}

//buscador rides
async function searchRides(event) {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(input => input.value);

  const searchParams = {
    from,
    to,
    days
  };

  try {
    const response = await fetch("http://localhost:3001/api/rides/search", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rides = await response.json();

    const tableBody = document.getElementById('ride-table-body');
    tableBody.innerHTML = '';

    rides.forEach(ride => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ride.user ? ride.user.first_name + ' ' + ride.user.last_name : 'N/A'}</td>
        <td>${ride.departureFrom}</td>
        <td>${ride.arriveTo}</td>
        <td>${ride.seats}</td>
        <td>${ride.vehicleDetails.make}</td>
        <td>${ride.fee}</td>
        <td><a href="#" class="request_button" id="${ride._id}" onclick="requestRide('${ride._id}')">Request</a></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error searching rides:', error.message);
    alert("Error searching rides: " + error.message);
  }
}

async function requestRide(rideId) {
  const token = localStorage.getItem('token'); // Obtener el ID del usuario logueado del local storage

  const bookingData = {
      token,
      rideId
  };

  try {
      const response = await fetch("http://localhost:3001/api/bookings", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON(bookingData)
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert("Ride requested successfully!");
      console.log('Booking result:', result);
  } catch (error) {
      console.error('Error requesting ride:', error.message);
      alert("Error requesting ride: " + error.message);
  }
}




// Llama a la función getRides al cargar la página
document.addEventListener("DOMContentLoaded", getRides);



//obtener los datos del usuario logueado por medio del id
async function getLoggedInUserInfo() {
  try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
          throw new Error('User ID not found in localStorage');
      }

      const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = await response.json();
      return userData;
  } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
  }
}

//muuestra los datos del usuario en el html
async function displayLoggedInUserName() {

  const userNameElement = document.getElementById('user-name');
  const userData = await getLoggedInUserInfo();

  if (userData && userData.first_name && userData.last_name) {
      userNameElement.textContent = `${userData.first_name} ${userData.last_name}`;
  } else {
      userNameElement.textContent = 'Guest';
  }
}

// Llama a la función para mostrar el nombre de usuario al cargar la página
document.addEventListener('DOMContentLoaded', displayLoggedInUserName);




function loadUserDetails() {
  try {
      const userData = localStorage.getItem('user');
      const userId = localStorage.getItem('userId');
      
      if (userData) {
          const user = JSON.parse(userData);
          
          if (user) {
              document.getElementById('first_name').value = user.first_name;
              document.getElementById('last_name').value = user.last_name;
              document.getElementById('cedula').value = user.cedula;
              document.getElementById('birthday').value = user.birthday;
              document.getElementById('email').value = user.email;
              document.getElementById('phone_number').value = user.phone_number;
              document.getElementById('address').value = user.address;
              document.getElementById('country').value = user.country;
              document.getElementById('state').value = user.state;
              document.getElementById('city').value = user.city;
              
          } else {
              console.error('El objeto user no tiene las propiedades esperadas');
          }
      } else {
          console.log('No hay datos de user en localStorage');
      }
  } catch (error) {
      console.error('Error al cargar los detalles del user:', error);
  }
}

//cerrar sesion al presionar el boton logout
function logout() {
  localStorage.removeItem('userId'); 
  window.location.href = '../auth/login.html'; 
}
