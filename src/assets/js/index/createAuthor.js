"use strict"

/**
 * Crear Autor
 */

// Asignaciones DOM
const formCreateAuthor = document.querySelector("#formCreateAuthor");
const messageCreateAuthor = document.querySelector("#messageCreateAuthor");
const imagenButton = document.querySelector("#imagenButtonCreateAuthor");
const imagenInput = document.querySelector("#imagenCreateAuthor");

// Lógica para el botón del Hidden Input
imagenButton.addEventListener("click", () => {
    imagenInput.click();
});

// Lógica para la subida de Imagen en el Cliente
imagenInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        imagenButton.textContent = "Archivo subido: " + file.name;
        imagenButton.style.backgroundColor = "#C8E1CD";
    } else {
        imagenButton.innerHTML = "Seleccionar Imagen";
        imagenButton.style.backgroundColor = "#eaeaea";
    }
});

// Lógica para el envio de datos al Servidor API
formCreateAuthor.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();

    const nombre = document.querySelector("#nombreCreateAuthor").value;
    const apellidos = document.querySelector("#apellidosCreateAuthor").value;
    const imagen = document.querySelector("#imagenCreateAuthor").files[0];
    const descripcion = document.querySelector("#descripcionCreateAuthor").value;

    formData.append("nombre", nombre);
    formData.append("apellidos", apellidos);
    formData.append("imagen", imagen);
    formData.append("descripcion", descripcion);

    try {
        const response = await fetch("/autores", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            console.log("Autor creado con éxito");
            messageCreateAuthor.style.color = "rgb(63 135 77)";
            messageCreateAuthor.textContent = "Autor creado con éxito"
            imagenButton.innerHTML = "Seleccionar Imagen";
            imagenButton.style.backgroundColor = "#eaeaea";
            formCreateAuthor.reset();
            setTimeout(() => {
                messageCreateAuthor.textContent = "";
            }, 3000);
        } else {
            console.log("Error al crear autor");
            messageCreateAuthor.style.color = "rgb(135 63 63)";
            messageCreateAuthor.textContent = "Error al crear Autor"
            setTimeout(() => {
                messageCreateAuthor.textContent = "";
            }, 3000);
        }

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
    }
});