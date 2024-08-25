// Asignar eventos de edición a los botones Editar
function assignEditEvents() {
    for (let el of document.getElementsByClassName("edit_button")) {
        el.addEventListener("click", (e) => {
            console.log(e.target.id);
            e.preventDefault();
        });
    }
}

// Asignar evento al formulario de ride
document.getElementById("rideForm").addEventListener("submit", createRide);

window.onload = function() {
    loadRideDetails();
};
