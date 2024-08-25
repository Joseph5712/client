// Crear ride
async function createRide(event) {
    event.preventDefault();

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

// Obtener rides del usuario logueado
async function getRides() {
    const userId = localStorage.getItem('userId');
    
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
                <td><a href="#" class="edit_button" id="edit" onclick="getRideById('${ride._id}')">Edit</a> | <a href="#" class="delete_button" onclick="deleteRide('${ride._id}')">Delete</a></td>
            `;
            tableBody.appendChild(row);
        });

        assignEditEvents();
    }
}

// Obtener un ride por su ID
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
            if (ride.days && typeof ride.days === 'object') {
                const days = [];
                for (const [day, isActive] of Object.entries(ride.days)) {
                    if (isActive) {
                        days.push(day);
                    }
                }
                ride.daysArray = days;
            }

            localStorage.setItem('ride', JSON.stringify(ride));
            localStorage.setItem('rideId', rideId)
            window.location.href = './edit_rides.html';
        }
    } catch (error) {
        console.error('Error fetching ride:', error.message);
    }
}

// Cargar detalles del ride en el formulario
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

// Actualizar un ride
async function updateRide(event) {
    event.preventDefault();

    const rideId = localStorage.getItem('rideId');
    if (!rideId) {
        console.error("No ride ID found in localStorage");
        alert("No ride ID found. Cannot update ride.");
        return;
    }

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
        window.location.href = 'rides_drivers.html';
    } catch (error) {
        console.error('Error updating ride:', error.message);
        alert("Error updating ride: " + error.message);
    }
}

// Eliminar un ride
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

        const rideElement = document.getElementById(`ride-${rideId}`);
        if (rideElement) {
            rideElement.remove();
        }

        return true;
    } catch (error) {
        console.error("Error deleting ride:", error.message);
        return false;
    }
}

// Buscar rides
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

window.onload = function() {
    loadRideDetails();
};

document.addEventListener("DOMContentLoaded", getRides);
