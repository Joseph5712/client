function assignEditEvents() {
    for (let el of document.getElementsByClassName("edit_button")) {
      el.addEventListener("click", (e) => {
        console.log(e.target.id);
        e.preventDefault();
      });
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
            <td><a href="#" class="edit_button" id="edit" onclick="getRideById('${ride._id}')" ">Edit</a> | <a href="#" class="delete_button" onclick="deleteRide('${ride._id}')">Delete</a></td>
          `;
        tableBody.appendChild(row);
      });
  
      assignEditEvents();
    }
  }

  async function getRideById(rideId) {
    try {
        const response = await fetch(`http://localhost:3001/api/rides/?id=${rideId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const ride = await response.json();

        if (ride) {
            // Verifica y almacena los días correctamente
            if (ride.days && typeof ride.days === 'object') {
                const days = [];
                for (const [day, isActive] of Object.entries(ride.days)) {
                    if (isActive) {
                        days.push(day);
                    }
                }
                ride.daysArray = days; // Almacena los días activos en un array
            }

            localStorage.setItem('ride', JSON.stringify(ride));
            localStorage.setItem('rideId',rideId)
            window.location.href = './edit_rides.html';
        }
    } catch (error) {
        console.error('Error fetching ride:', error.message);
    }
}

function loadRideDetails() {
    try {
        const rideData = localStorage.getItem('ride');
        const rideId = localStorage.getItem('rideId');
        
        if (rideData) {
            const ride = JSON.parse(rideData);
            
            if (ride && ride.departureFrom && ride.arriveTo && ride.time && ride.seats && ride.fee && ride.vehicleDetails && ride.days) {
                document.getElementById('departure').value = ride.departureFrom;
                document.getElementById('arrived').value = ride.arriveTo;
                document.getElementById('time').value = ride.time;
                document.getElementById('seats').value = ride.seats;
                document.getElementById('fee').value = ride.fee;
                document.getElementById('make').value = ride.vehicleDetails.make;
                document.getElementById('model').value = ride.vehicleDetails.model;
                document.getElementById('year').value = ride.vehicleDetails.year;

                if (ride.daysArray && Array.isArray(ride.daysArray)) {
                    ride.daysArray.forEach(day => {
                        const dayCheckbox = document.getElementById(day);
                        if (dayCheckbox) {
                            dayCheckbox.checked = true;
                        }
                    });
                } else {
                    console.error('El objeto ride no tiene un array de días esperado');
                }
            } else {
                console.error('El objeto ride no tiene las propiedades esperadas');
            }
        } else {
            console.log('No hay datos de ride en localStorage');
        }
    } catch (error) {
        console.error('Error al cargar los detalles del ride:', error);
    }
}
  
  // Cargar los detalles del ride al cargar la página
  window.onload = function() {
    loadRideDetails();
  };
  
  async function updateRide(event) {
    event.preventDefault();

    // Obtener el ID del ride que se va a actualizar (debería estar en algún lugar en el formulario o en localStorage)
    const rideId = localStorage.getItem('rideId');
    if (!rideId) {
        console.error("No ride ID found in localStorage");
        alert("No ride ID found. Cannot update ride.");
        return;
    }

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
        days: days, // Pasar el objeto days directamente
        time: document.getElementById('time').value,
        seats: parseInt(document.getElementById('seats').value, 10),
        fee: parseFloat(document.getElementById('fee').value),
        vehicleDetails: {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value, 10)
        }
    };

    try {
        let response = await fetch(`http://localhost:3001/api/rides/?id=${rideId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ride)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let rideData = await response.json();
        console.log("Ride updated:", rideData);
        alert("Ride updated successfully");
        // Redirigir a otra página si es necesario
        window.location.href = 'rides.html';
    } catch (error) {
        console.error('Error updating ride:', error.message);
        alert("Error updating ride: " + error.message);
    }
}


async function deleteRide(rideId) {
  try {
    console.log('Deleting ride with ID:', rideId);
    const response = await fetch(`http://localhost:3001/api/rides/?id=${rideId}`, {
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

function logout() {
    localStorage.removeItem('userId'); 
    window.location.href = 'login.html'; 
  }

  