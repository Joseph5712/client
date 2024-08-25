// Crear usuario
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

    if (response && response.status == 201) {
        user = await response.json();
        console.log("User saved", user);
        alert("Usuario guardado");
    } else {
        alert("Shit's on fire! ");
    }
}

//se valida el login 
async function login() {
    let userLogin =  {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const response = await fetch("http://localhost:3001/api/session", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    });

    if (response && response.status == 201) {
        const tokenData = await response.json();
        console.log('Token saved', tokenData);

        // Guardar el token en sessionStorage
        sessionStorage.setItem('token', tokenData.token);
        
        alert(`Welcome ${tokenData.user}`);

        // Redirigir según el rol del usuario
        if (tokenData.role === 'driver') {
            document.location.href = '../rides/rides_drivers.html'; // Página del conductor
        } else {
            document.location.href = '../rides/Home.html'; // Página del usuario
        }
    } else {
        alert("Login failed. Please check your credentials and try again.");
    }
}



// Obtener datos del usuario logueado
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

// Mostrar nombre del usuario logueado en el HTML
async function displayLoggedInUserName() {
    const userNameElement = document.getElementById('user-name');
    const userData = await getLoggedInUserInfo();

    if (userData && userData.first_name && userData.last_name) {
        userNameElement.textContent = `${userData.first_name} ${userData.last_name}`;
    } else {
        userNameElement.textContent = 'Guest';
    }
}

// Cargar detalles del usuario en el formulario
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

// Cerrar sesión
function logout() {
    localStorage.removeItem('userId');
    window.location.href = '../auth/login.html';
}

document.addEventListener('DOMContentLoaded', displayLoggedInUserName);
