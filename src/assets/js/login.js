const loginForm = document.querySelector("#loginForm");
const messageDiv = document.querySelector("#message");

let csrf = ""
const getCsrf = async () => {
    try {
        const csrfResponse = await fetch(`/csrf`);
        const csrfToken = await csrfResponse.json()
        csrf = csrfToken.csrfToken;
    } catch(err) {
        console.error("No se ha podido obtener CSRF Token: ", err)
    }
}

getCsrf()


loginForm.addEventListener("submit", async (event) => {
    const username = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    event.preventDefault();

    try {        
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrf
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        })

        const data = await response.json();

        if (response.ok) {
            console.log("Autenticación exitosa!");
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        } else {
            console.log("Error en la Autenticación: " + data.message);
            messageDiv.textContent = "Fallo en la autenticación"
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});

// TODO Crear Alertas personalizadas