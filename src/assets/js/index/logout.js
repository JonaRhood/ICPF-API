/**
 * 
 * Lógica para Cerrar Sesión
 * 
 */

// Asignaciones del DOM
const logoutButton = document.querySelector("#logoutButton");

logoutButton.addEventListener("click", async (e) => {
    e.preventDefault()
    try {
        const response = await fetch(`/logout`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            window.location.href = "/login_libreria"
        }
    } catch (err) {
        console.error("Error intendando cerrar sesión: ", err)
    }
})