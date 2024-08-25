// Obtener bookings del cliente logueado
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
async function requestRide(rideId) {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario logueado del local storage

    const bookingData = {
        userId,
        rideId
    };

    try {
        const response = await fetch("http://localhost:3001/api/bookings", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
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