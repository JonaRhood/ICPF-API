const loginForm = document.querySelector("#loginForm");
const messageDiv = document.querySelector("#message");

loginForm.addEventListener("submit", async (event) => {
    const username = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    event.preventDefault();

    try {
        const response = await fetch("/autores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Autenticación exitosa!");
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        } else {
            console.log("Error en la Autenticación: " + data.message);
            message.textContent = "Fallo en la autenticación"
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});