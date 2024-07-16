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
  //se muestra un ride con un id especifico del user(1 userDrive puede tener varios rides)
  async function getRides_user() {
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
          <td>${ride.user ? ride.user.first_name + ' ' + ride.user.last_name : 'N/A'}</td>
          <td>${ride.departureFrom}</td>
          <td>${ride.arriveTo}</td>
          
          
          
          <td><a href="#" class="edit_button" id="${ride._id}">Edit</a></td>
        `;
        tableBody.appendChild(row);
      });
  
      assignEditEvents();
    }
  }

  //se muestran los rides
  async function getRides() {
    const userId = localStorage.getItem('userId'); // Obtén el userId del localStorage
  
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
  
    const response = await fetch(`http://localhost:3001/api/rides`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const rides = await response.json();
  
    if (rides) {
      const userRides = rides.filter(ride => ride.user._id === userId);
  
      const tableBody = document.getElementById("ride-table-body");
      tableBody.innerHTML = "";
  
      userRides.forEach((ride) => {
        const row = document.createElement("tr");
        row.id = `ride-${ride._id}`;
        row.innerHTML = `
            <td>${ride.departureFrom}</td>  
            <td>${ride.arriveTo}</td>
            <td>${ride.seats}</td>
            <td>${ride.vehicleDetails.make}</td>
            <td>${ride.fee}</td>
            <td><a href="#" class="edit_button" id="${ride._id}">Edit</a> | <a href="#" class="delete_button" onclick="deleteRide('${ride._id}')">Delete</a></td>
          `;
        tableBody.appendChild(row);
      });
  
      assignEditEvents();
    }
  }
//se obtiene un ride con si id especifico
async function getRideById(rideId){
  const response =await fetch("http://localhost:3001/api/rides/?id=${rideId}",{
    method: "GET",
    headers: {
      "Content-Type":"application/json",
    },
  });

  const ride = await response.json();
  if(ride){
    document.getElementById('departure').value = ride.departureFrom;
    document.getElementById('arrived').value = ride.arriveTo;
    document.getElementById('time').value = ride.time;
    document.getElementById('seats').value = ride.seats;
    document.getElementById('fee').value = ride.fee;
    document.getElementById('make').value = ride.vehicleDetails.make;
    document.getElementById('model').value = ride.vehicleDetails.model;
    document.getElementById('year').value = ride.vehicleDetails.year;
    ride.days.forEach(day => {
      document.getElementById(day).checked = true;
  });
  }

}

async function deleteRide(rideId) {
  try {
    console.log('Deleting ride with ID:', rideId);
    const response = await fetch(`http://localhost:3001/api/rides/?_id:${rideId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log("Ride deleted successfully");

    // Opcionalmente, eliminar la fila del ride eliminado de la tabla
    const rideElement = document.getElementById(`ride-${rideId}`);
    if (rideElement) {
      rideElement.remove();
    }

    return true; // Retornar true para indicar que la eliminación fue exitosa
  } catch (error) {
    console.error("Error deleting ride:", error.message);
    return false; // Retornar false para indicar que hubo un error
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
            window.location.href = 'rides.html';
            break;
          case 'user':
            window.location.href = 'Home.html';
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
      days: days.value,
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
  

  // Obtener valores del formulario
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(input => input.value);
  
  // Construir objeto de búsqueda
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

    // Limpiar la tabla antes de mostrar los resultados
    const tableBody = document.getElementById('ride-table-body');
    tableBody.innerHTML = '';

    // Mostrar los rides encontrados en la tabla
    rides.forEach(ride => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ride.user ? ride.user.first_name + ' ' + ride.user.last_name : 'N/A'}</td>
        <td>${ride.departureFrom}</td>
        <td>${ride.arriveTo}</td>
        <td>${ride.seats}</td>
        <td>${ride.vehicleDetails.make}</td>
        <td>${ride.fee}</td>
        <td><a href="#" class="edit_button" id="${ride._id}">Edit</a></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error searching rides:', error.message);
    alert("Error searching rides: " + error.message);
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


//cerrar sesion al presionar el boton logout
function logout() {
  localStorage.removeItem('userId'); 
  window.location.href = 'login.html'; 
}
