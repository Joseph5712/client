// Obtener bookings del cliente logueado
async function getClientBookings() {
    const token = sessionStorage.getItem('token'); // Obtener el token desde sessionStorage
    console.log(token);
    if (!token) {
        console.error("No token found in sessionStorage");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/api/bookingsClient", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Incluye el token en los encabezados
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const bookings = await response.json();
        console.log(bookings);

        const tableBody = document.getElementById("ride-table-body");
        tableBody.innerHTML = "";

        bookings.forEach((booking) => {
            if (booking.ride) {  // Verificar que booking.ride no sea null
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
            } else {
                console.warn(`Booking with ID ${booking._id} has no associated ride.`);
            }
        });
    } catch (error) {
        console.error('Error fetching client bookings:', error.message);
        alert("Error fetching client bookings: " + error.message);
    }
}




// Obtener bookings del driver logueado
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

// Solicitar un ride
// Solicitar un ride
async function requestRide(rideId) {
    const token = sessionStorage.getItem('token'); // Obtener el token desde sessionStorage

    if (!token) {
        console.error("No token found in sessionStorage");
        return;
    }

    const bookingData = {
        rideId
    };

    try {
        const response = await fetch("http://localhost:3001/api/bookings", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluye el token en los encabezados
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            // Verifica si la respuesta es texto y no JSON
            const errorText = await response.text(); // Lee el texto de la respuesta
            throw new Error(errorText || `HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        alert("Ride requested successfully!");
        console.log('Booking result:', result);
    } catch (error) {
        console.error('Error requesting ride:', error.message);
        alert("Error requesting ride: " + error.message);
    }
}


